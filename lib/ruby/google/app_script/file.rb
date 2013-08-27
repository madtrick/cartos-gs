module Cartos
  module Google
    module AppScript
      class Script

        def self.load(path)
          self.new(nil, path, nil).load
        end

        attr_reader :id, :body

        def initialize(id, path, body)
          @id   = id
          @path = path
          @body = body
        end

        def name
          File.basename(@path, File.extname(@path))
        end

        def save
          File.open @path, "w" do |file|
            file.write @body
          end

          File.open id_file_path, "w" do |file|
            file.write @id
          end
        end

        def load
          @id   = load_id
          @body = load_body
          self
        end

      private

        def load_id
          IO.readlines(id_file_path).first
        end

        def load_body
          File.open @path, "r" do |file|
            @body = file.read
          end
        end

        def id_file_path
          "#{File.dirname(@path)}/.id.#{File.basename(@path)}"
        end

      end
    end
  end
end
