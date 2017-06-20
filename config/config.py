settings = {}


def get_settings():
    return settings


def set_settings(key, value):
    settings[key] = value
    return settings


def update(settings_to_update_with):
    settings.update(settings_to_update_with)
    return settings
