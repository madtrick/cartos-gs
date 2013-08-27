require "httparty"
require "launchy"

require_relative "ruby/config"
require_relative "ruby/google/api/client"
require_relative "ruby/google/app_script/project"
require_relative "ruby/google/app_script/file"

module Cartos
  def self.config=(config)
    @config = config
  end

  def self.config
    @config
  end
end

Cartos.config = Cartos::Config.new
