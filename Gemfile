source "https://rubygems.org"

# GitHub Pages compatible
gem "github-pages", group: :jekyll_plugins

# Plugins pour le développement
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.12"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-seo-tag", "~> 2.8"
end

# Windows et JRuby ne supportent pas les gems natives
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end