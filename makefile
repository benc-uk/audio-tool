.PHONY: help clean deploy build pre-reqs
.DEFAULT_GOAL := help

help: ## 💬 This help message :)
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST)  | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

clean: ## 🧹 Clean
	@rm -rf node_modules

run: ./node_modules ## 🔨 Run local server
	node ./node_modules/.bin/browser-sync start --server --single --no-ui --no-open --no-notify --watch

# ============================================================================

./node_modules: ./package.json
	npm install browser-sync --silent
	touch -m ./node_modules

./package.json: 
	@echo "package.json was modified"
