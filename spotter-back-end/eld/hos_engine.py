from datetime import timedelta

from .models import HOSLog

DUTY_STATUS = (
    ('OFF', 'Off Duty'),
    ('SB', 'Sleeper Berth'),
    ('D', 'Driving'),
    ('ON', 'On Duty Not Driving'),
)


def get_daily_driving_hours(driver, date):
    logs = HOSLog.objects.filter(driver=driver, date=date, duty_status='D')
    return sum([timedelta(minutes=log.duration) for log in logs], timedelta())


def get_daily_on_duty_hours(driver, date):
    logs = HOSLog.objects.filter(
        driver=driver, date=date, duty_status__in=['D', 'ON'])
    return sum([timedelta(minutes=log.duration) for log in logs], timedelta())


def has_10_hour_rest(driver, date):
    logs = HOSLog.objects.filter(
        driver=driver, date=date).order_by('start_time')
    off_period = timedelta()
    for log in logs:
        if log.duty_status in ['OFF', 'SB']:
            off_period += timedelta(minutes=log.duration)
            if off_period >= timedelta(hours=10):
                return True
        else:
            off_period = timedelta()
    return False


def get_rolling_8_day_hours(driver, end_date):
    start_date = end_date - timedelta(days=7)
    logs = HOSLog.objects.filter(driver=driver, date__range=(
        start_date, end_date), duty_status__in=['D', 'ON'])
    return sum([timedelta(minutes=log.duration) for log in logs], timedelta())


def can_restart_34_hour(driver, end_date):
    start_date = end_date - timedelta(days=7)
    logs = HOSLog.objects.filter(driver=driver, date__range=(
        start_date, end_date)).order_by('start_time')
    off_period = timedelta()
    last_end = None
    for log in logs:
        if log.duty_status in ['OFF', 'SB']:
            if last_end and (log.start_time - last_end) > timedelta(minutes=1):
                off_period = timedelta()
            off_period += timedelta(minutes=log.duration)
            if off_period >= timedelta(hours=34):
                return True
        else:
            off_period = timedelta()
        last_end = log.start_time + timedelta(minutes=log.duration)
    return False


def validate_hos(driver, date):
    errors = []
    if get_daily_driving_hours(driver, date) > timedelta(hours=11):
        errors.append("Exceeded 11-hour driving limit.")
    if get_daily_on_duty_hours(driver, date) > timedelta(hours=14):
        errors.append("Exceeded 14-hour on-duty limit.")
    if not has_10_hour_rest(driver, date):
        errors.append("No 10-hour consecutive rest.")
    if get_rolling_8_day_hours(driver, date) > timedelta(hours=70):
        errors.append("Exceeded 70-hour/8-day cycle.")
    return errors
