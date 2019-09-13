# -*- coding: utf-8 -*-
from __future__ import absolute_import

import cherrypy

from . import ApiController, RESTController
from .. import logger, mgr
from ..exceptions import DashboardException
from ..services.auth import AuthManager, JwtManager
from ..settings import Settings


@ApiController('/auth', secure=False)
class Auth(RESTController):
    """
    Provide authenticates and returns JWT token.
    """

    def create(self, username, password):
        user_data = AuthManager.authenticate(username, password)
        user_perms, pwd_expiry_date = None, None
        if user_data:
            user_perms, pwd_expiry_date = user_data.values()

        if user_perms is not None:
            logger.debug('Login successful')
            token = JwtManager.gen_token(username)
            token = token.decode('utf-8')
            cherrypy.response.headers['Authorization'] = "Bearer: {}".format(token)
            return {
                'token': token,
                'username': username,
                'permissions': user_perms,
                'pwdExpiryData': self._get_pwd_expiry_data(pwd_expiry_date),
                'sso': mgr.SSO_DB.protocol == 'saml2'
            }

        logger.debug('Login failed')
        raise DashboardException(msg='Invalid credentials',
                                 code='invalid_credentials',
                                 component='auth')

    def _get_pwd_expiry_data(self, pwd_expiry_date):
        if not pwd_expiry_date:
            return None

        return {
            'pwd_expiry_date': pwd_expiry_date,
            'user_pwd_expiry_warning_1': Settings.USER_PWD_EXPIRY_WARNING_1,
            'user_pwd_expiry_warning_2': Settings.USER_PWD_EXPIRY_WARNING_2,
            'user_pwd_default_expiry_span': Settings.USER_PWD_DEFAULT_EXPIRY_SPAN
        }

    @RESTController.Collection('POST')
    def logout(self):
        logger.debug('Logout successful')
        token = JwtManager.get_token_from_header()
        JwtManager.blacklist_token(token)
        redirect_url = '#/login'
        if mgr.SSO_DB.protocol == 'saml2':
            redirect_url = 'auth/saml2/slo'
        return {
            'redirect_url': redirect_url
        }

    def _get_login_url(self):
        if mgr.SSO_DB.protocol == 'saml2':
            return 'auth/saml2/login'
        return '#/login'

    @RESTController.Collection('POST')
    def check(self, token):
        if token:
            user = JwtManager.get_user(token)
            if user:
                return {
                    'username': user.username,
                    'permissions': user.permissions_dict(),
                    'sso': mgr.SSO_DB.protocol == 'saml2'
                }
        return {
            'login_url': self._get_login_url(),
        }
