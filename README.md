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

### 2. Build and push Docker images

For the backend:
```bash
cd path/to/backend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/eudr-supplier-backend
```

For the frontend:
```bash
cd path/to/frontend
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/eudr-supplier-frontend
```

### 3. Deploy to Cloud Run

Deploy the backend:
```bash
gcloud run deploy eudr-supplier-backend \
  --image gcr.io/YOUR_PROJECT_ID/eudr-supplier-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

Deploy the frontend:
```bash
gcloud run deploy eudr-supplier-frontend \
  --image gcr.io/YOUR_PROJECT_ID/eudr-supplier-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### 4. Set up environment variables (if needed)
If your backend requires environment variables (e.g., for database connections), you can set them during deployment:

```bash
gcloud run deploy eudr-supplier-backend \
  --image gcr.io/YOUR_PROJECT_ID/eudr-supplier-backend \
  --set-env-vars "KEY1=VALUE1,KEY2=VALUE2"
```

### 5. Update frontend configuration
After deploying, update your frontend's API_URL to point to the deployed backend URL. You can get the backend URL from the Cloud Run console or by running:

```bash
gcloud run services describe eudr-supplier-backend --platform managed --region us-central1 --format 'value(status.url)'
```

Update the API_URL in your frontend code and redeploy if necessary.

### 6. (Optional) Set up a custom domain
If you want to use a custom domain, you can configure it in the Cloud Run console or using gcloud commands.

Remember to handle CORS properly in your backend to allow requests from your frontend's domain.