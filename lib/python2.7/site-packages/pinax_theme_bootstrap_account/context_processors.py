from pinax_theme_bootstrap_account.conf import settings


def theme(request):
    ctx = {
        "THEME_ACCOUNT_ADMIN_URL": settings.THEME_ACCOUNT_ADMIN_URL,
        "THEME_ACCOUNT_CONTACT_EMAIL": settings.THEME_ACCOUNT_CONTACT_EMAIL,
    }
    return ctx
