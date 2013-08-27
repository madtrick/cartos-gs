require 'google/api_client'

module Cartos
  module Google
    module API
      class Client
        SCOPES = ["https://www.googleapis.com/auth/drive.scripts", "https://www.googleapis.com/auth/drive"]


        def initialize
          @google_client = ::Google::APIClient.new
          @google_client.authorization.client_id     = oauth_client_id
          @google_client.authorization.client_secret = oauth_client_secret
          @google_client.authorization.redirect_uri  = oauth_redirect_uri
          @google_client.auto_refresh_token          = oauth_auto_refresh
          @google_client.authorization.access_token  = oauth_access_token
          @google_client.authorization.refresh_token = oauth_refresh_token
          @google_client.authorization.scope         = SCOPES.join " "
        end

        def access_token
          @google_client.authorization.access_token
        end

        def execute(api, api_method, params, options = {})
          authorize unless authorized?

          google_api = @google_client.discovered_api(api, options[:version])
          api_method = eval("google_api.#{api_method}")
          api_method.method_base = options[:method_base] if options[:method_base]
          @google_client.execute(
            api_method: api_method,
            parameters: params,
            headers: options[:headers],
            body_object: options[:body_object]
          )
        end

      private
        def authorize
          Launchy.open(@google_client.authorization.authorization_uri)

          @google_client.authorization.code = Cartos.config.request "oauth.authorization_code", "Enter oauth.authorization_code: "
          @google_client.authorization.fetch_access_token!

          Cartos.config.set "oauth.authorization_code", @google_client.authorization.code
          Cartos.config.set "oauth.access_token", @google_client.authorization.access_token
          Cartos.config.set "oauth.refresh_token", @google_client.authorization.refresh_token

          Cartos.config.save
        end

        def authorized?
          ! @google_client.authorization.access_token.nil?
        end

        def oauth_access_token
          Cartos.config.get "oauth.access_token"
        end

        def oauth_client_id
          get_or_request_config_value "oauth.client_id"
        end

        def oauth_client_secret
          get_or_request_config_value "oauth.client_secret"
        end

        def oauth_redirect_uri
          get_or_request_config_value "oauth.redirect_uri", 'urn:ietf:wg:oauth:2.0:oob'
        end

        def oauth_refresh_token
          Cartos.config.get "oauth.refresh_token"
        end

        def oauth_auto_refresh
          get_or_request_config_value "oauth.auto_refresh", true
        end

        def get_or_request_config_value(key, default = nil)
          Cartos.config.get_or_request key, default
        end

      end
    end
  end
end
