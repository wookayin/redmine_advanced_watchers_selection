require 'redmine'

require_dependency 'advanced_watchers/hooks'
Redmine::Plugin.register :redmine_advanced_watchers_selection do
  name 'Redmine Advanced Watchers Selection'
  author 'Jongwook Choi'
  description 'Allows issue creator to select multiple watchers in convenience.'
  version '0.1.0'
  author_url 'https://github.com/wookayin/redmine_advanced_watchers_selection'
end

