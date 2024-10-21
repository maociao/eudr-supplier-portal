# Deploying to Google Cloud Run

## Prerequisites
1. Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
2. Enable the Cloud Run API in your Google Cloud Console
3. Install Docker on your local machine

## Steps

### 1. Set up Google Cloud project
```bash
gcloud init
gcloud config set project YOUR_PROJECT_ID
```

### 2. Build and deploy backend

Build the backend:
```bash
cd path/to/backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/eudr-supplier-portal-be
```

Deploy the backend:
```bash
gcloud run deploy eudr-supplier-portal-be \
  --image gcr.io/YOUR_PROJECT_ID/eudr-supplier-portal-be \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

Get the URL of your backend:
```bash
gcloud run services describe eudr-supplier-portal-be --platform managed --region us-central1 --format 'value(status.url)'
```

### 3. Build and deploy frontend

Build the frontend:
```bash
cd path/to/frontend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/eudr-supplier-portal-fe
```

Deploy the frontend (replace `your-backend-url` with the URL of your backend):
```bash
gcloud run deploy eudr-supplier-portal-fe \
  --image gcr.io/YOUR_PROJECT_ID/eudr-supplier-portal-fe \
  --platform managed \
  --region us-central1 \
  --set-env-vars REACT_APP_API_URL=https://your-backend-url \
  --allow-unauthenticated
```

### 4. Set up environment variables (if needed)
If your backend requires environment variables (e.g., for database connections), you can set them during deployment:

```bash
gcloud run deploy eudr-supplier-portal-be \
  --image gcr.io/YOUR_PROJECT_ID/eudr-supplier-portal-be \
  --set-env-vars "KEY1=VALUE1,KEY2=VALUE2"
```

### 5. (Optional) Set up a custom domain
If you want to use a custom domain, you can configure it in the Cloud Run console or using gcloud commands.

Remember to handle CORS properly in your backend to allow requests from your frontend's domain.