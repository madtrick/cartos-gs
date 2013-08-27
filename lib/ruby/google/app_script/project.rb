module Cartos
  module Google
    module AppScript
      class Project
        include HTTParty

        def initialize(client)
          @client      = client
        end

        def import
          response = self.class.get script_google_export_link, {headers: {'Authorization' => "Bearer #{@client.access_token}"}}
          if response.code == 200
            response["files"].each do |file_data|
              Cartos::Google::AppScript::Script.new(file_data["id"], File.expand_path("lib/gs/#{file_data["name"]}.gs"), file_data["source"]).save
            end

            puts "Scripts successfully imported"
          else
            puts "Scripts import failed"
          end
        end

        def export
          files = scripts.map do |script|
            {id: script.id, name: script.name, source: script.body, type: "server_js"}
          end

          # There's no direct method to update an existing file in google drive using the discovy api infrastructure
          # In this situation I had to overwrite the method base to the expected URL: https://www.googleapis.com/upload/drive/v2/
          # NOTICE that the trailing /files is missing, otherwise the file google client will append another /files

          result = @client.execute "drive", "files.update", {'fileId' => api_project_id}, {method_base: "https://www.googleapis.com/upload/drive/v2/", version: "v2", body_object: {files: files}, headers: {"Content-Type" => "application/vnd.google-apps.script+json"}}

          if result.status == 200
            puts "Scripts successfully exported to Google"
          else
            puts "Scripts export to Google failed"
          end
        end

      private

        def api_project_id
          Cartos.config.get_or_request "project.id"
        end

        def script_google_export_link
          response = @client.execute "drive", "files.get", {'fileId' => api_project_id}, {version: "v2"}
          response.data["exportLinks"]["application/vnd.google-apps.script+json"]
        end

        def scripts
          Dir.glob("lib/gs/*").map do |entry|
            Cartos::Google::AppScript::Script.load entry
          end
        end

      end
    end
  end
end
