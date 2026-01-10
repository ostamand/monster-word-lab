build:
	docker build -t us-central1-docker.pkg.dev/multimodal-custom-agent/monster-word-lab-app/agent:latest .
run:
	docker run -p 8080:8080 -e PORT=8080 -it --rm us-central1-docker.pkg.dev/multimodal-custom-agent/monster-word-lab-app/agent:latest
push:
	docker push us-central1-docker.pkg.dev/multimodal-custom-agent/monster-word-lab-app/agent:latest
deploy:
	gcloud run deploy monster-word-lab-agent \
		--image us-central1-docker.pkg.dev/multimodal-custom-agent/monster-word-lab-app/agent:latest \
		--region us-central1 \
		--min-instances 1 \
  		--max-instances 2 \
		--platform managed
proxy:
	gcloud run services proxy monster-word-lab-agent --port=8080