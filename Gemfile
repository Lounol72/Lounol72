source "https://rubygems.org"

# Jekyll core
gem "jekyll", "~> 4.3"

# Plugins Jekyll
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.15"
  gem "jekyll-sitemap", "~> 1.4"
  gem "jekyll-seo-tag", "~> 2.8"
end

# Thème minima
gem "minima", "~> 2.5"

# Windows et JRuby ne supportent pas les gems natives
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end