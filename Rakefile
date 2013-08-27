require 'rubygems'
require 'bundler/setup'

require_relative "lib/cartos"

desc "Imports into the current working dir the scripts from a project in https://script.google.com"
task :import  do
  client = Cartos::Google::API::Client.new
  project = Cartos::Google::AppScript::Project.new client
  project.import
end

desc "Exports the scripts in the current working dir to a project in https://script.google.com"
task :export do
  client = Cartos::Google::API::Client.new
  project = Cartos::Google::AppScript::Project.new client
  project.export
end

