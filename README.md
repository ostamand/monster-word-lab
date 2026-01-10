## Setup

### Install dependencies

```sh
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Setup gcloud for local development

```sh
gcloud auth login
gcloud auth auth application-default login
gcloud config set project <project-name>
```

Configure docker for Artifact Registry

```sh
gcloud auth configure-docker <LOCATION>-docker.pkg.dev
```

## Deployment

Create service account for public api


```sh
gcloud iam service-accounts create monster-word-lab-api \
    --display-name="Monster Word Lab Public API"
```

Assign it to the public api.

```sh
gcloud run services update monster-word-lab-api \
  --service-account "monster-word-lab-api@$(gcloud config get-value project).iam.gserviceaccount.com"
```

Grant permission to call the private service (the agent)

```sh
gcloud run services add-iam-policy-binding monster-word-lab-agent \
  --region=us-east4 \
  --member="serviceAccount:monster-word-lab-api@$(gcloud config get-value project).iam.gserviceaccount.com" \
  --role="roles/run.invoker"
```