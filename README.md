## Setup

```sh
gcloud auth login
gcloud auth auth application-default login
gcloud config set project multimodal-custom-agent
```

Configure docker for Artifact Registry

```sh
gcloud auth configure-docker <LOCATION>-docker.pkg.dev
```

## Deployment

### Agent Cloud Run

Get project number.

```sh
gcloud projects describe [PROJECT_ID]
```

Update default compute service account roles ie. `{projectNumber}-compute@developer.gserviceaccount.com`

![alt text](doc/service-account.png)
