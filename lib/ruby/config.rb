require "yaml"

module Cartos
  class Config
    CONFIG_FILE = "~/.cartos-gs.yml"
    def initialize
      @config = load_config || {}
    end

    def get_or_request(key, default = nil)
      (value = get(key)) and return value

      if default
        set key, default
      else
        request key, "Enter #{key}: "
      end

      save and return get(key)
    end

    def get(keys)
      keys = keys.split(".")
      temp = @config
      keys[0...-1].each do |key|
        if temp.key? key
          temp = temp[key]
        else
          return nil
        end
      end

      return temp[keys.last]
    end

    def set(keys, value)
      keys = keys.split(".")
      temp = @config
      keys[0...-1].each do |key|
        if temp.key? key
          temp = temp[key]
        else
          temp[key] = {}
          temp = temp[key]
        end
      end

      temp[keys.last] = value
    end

    def request(value, prompt)
      keys = value.split(".")
      temp = @config

      # Skip the last key
      # as that must be a raw
      # value (string, number, etc)
      # not a Hash
      keys[0...-1].each do |key|
        if temp.key? key
          temp = temp[key]
        else
          temp[key] = {}
          temp = temp[key]
        end
      end

      $stdout.write  prompt
      temp[keys.last] = $stdin.gets.chomp
    end

    def save
      File.open config_file_path, "w" do |file|
        file.write @config.to_yaml
      end
    end

  private

    def load_config
      if File.exist? config_file_path
        YAML::load_file config_file_path
      end
    end

    def config_file_path
      File.expand_path CONFIG_FILE
    end
  end
end
