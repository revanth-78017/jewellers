# API Keys Setup Guide

This guide will walk you through obtaining all the necessary API keys for the Jewelry Design App.

## 📋 Required API Keys

1. **OpenAI API Key** (DALL-E 3) - For AI jewelry design generation
2. **Unsplash Access Key** - For real jewelry photo gallery
3. **Cloudinary Credentials** - For image storage and optimization
4. **LangSmith API Key** (Optional) - For monitoring

---

## 🔐 OpenAI API Key (DALL-E 3)

### Purpose
Generate photorealistic jewelry images based on user specifications.

### Steps to Get API Key

1. **Visit OpenAI Platform**
   - Go to [https://platform.openai.com](https://platform.openai.com)

2. **Create Account / Sign In**
   - Sign up for a new account or log in with existing credentials

3. **Navigate to API Keys**
   - Click on your profile (top-right)
   - Select "API keys" from the dropdown menu

4. **Create New Key**
   - Click "Create new secret key"
   - Give it a name (e.g., "Jewelry App")
   - Copy the key immediately (you won't be able to see it again!)
   - Key format: `sk-proj-...`

5. **Add Billing Information**
   - Go to Settings > Billing
   - Add payment method
   - Set usage limits to control costs

### Pricing
- **DALL-E 3**: $0.040 per image (1024x1024, standard quality)
- **DALL-E 3 HD**: $0.080 per image (1024x1024, HD quality)

### Add to .env.local
```env
OPENAI_API_KEY=sk-proj-your_key_here
```

---

## 🖼️ Unsplash Access Key

### Purpose
Fetch real, high-quality jewelry photographs for the gallery.

### Steps to Get API Key

1. **Visit Unsplash Developers**
   - Go to [https://unsplash.com/developers](https://unsplash.com/developers)

2. **Create Account / Sign In**
   - Sign up or log in with your Unsplash account

3. **Register New Application**
   - Click "Your apps" in the top navigation
   - Click "New Application"
   - Accept the API Use and Guidelines
   - Fill in application details:
     - **Application name**: "Jewelry Design App"
     - **Description**: "AI-powered jewelry design platform"

4. **Copy Access Key**
   - Once created, you'll see your Access Key
   - Copy the Access Key (NOT the Secret Key)

### Rate Limits
- **Demo**: 50 requests per hour (free)
- **Production**: Apply for higher limits once you're ready

### Important: Attribution Required
You must provide attribution to photographers. Our app already handles this in the gallery component.

### Add to .env.local
```env
UNSPLASH_ACCESS_KEY=your_access_key_here
```

---

## ☁️ Cloudinary Credentials

### Purpose
Store generated images, optimize delivery, and handle image transformations.

### Steps to Get Credentials

1. **Visit Cloudinary**
   - Go to [https://cloudinary.com](https://cloudinary.com)

2. **Sign Up**
   - Click "Sign Up for Free"
   - Choose "Developer" plan
   - Complete registration

3. **Access Dashboard**
   - After login, you'll see your dashboard
   - Your credentials are displayed prominently

4. **Copy Three Values**
   - **Cloud Name**: e.g., `dxxxxxxx`
   - **API Key**: e.g., `123456789012345`
   - **API Secret**: e.g., `aBcDeFgHiJkLmNoPqRsTuVwXyZ`

### Pricing (Free Tier)
- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25,000 per month

### Add to .env.local
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 🔍 LangSmith API Key (Optional)

### Purpose
Monitor AI interactions, track performance, and debug issues.

### Steps to Get API Key

1. **Visit LangSmith**
   - Go to [https://smith.langchain.com](https://smith.langchain.com)

2. **Create Account**
   - Sign up with email or GitHub

3. **Create API Key**
   - Go to Settings
   - Navigate to API Keys section
   - Click "Create API Key"
   - Copy the key (starts with `ls__`)

4. **Create Project**
   - Create a new project named "jewelry-app"

### Add to .env.local
```env
LANGCHAIN_API_KEY=ls__your_key_here
LANGCHAIN_PROJECT=jewelry-app
LANGCHAIN_TRACING_V2=true
```

---

## 🎯 Final .env.local File

After obtaining all keys, your `.env.local` file should look like this:

```env
# OpenAI API for DALL-E 3 image generation
OPENAI_API_KEY=sk-proj-abc123xyz789...

# Unsplash API for real jewelry photos
UNSPLASH_ACCESS_KEY=abc123xyz789...

# Cloudinary for image storage and optimization
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ

# LangSmith for monitoring (optional)
LANGCHAIN_API_KEY=ls__abc123xyz789...
LANGCHAIN_PROJECT=jewelry-app
LANGCHAIN_TRACING_V2=true

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## ✅ Verification

After setting up all keys, verify they work:

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Test AI Generation**
   - Navigate to [http://localhost:3000/design](http://localhost:3000/design)
   - Select options and click "Generate Design"
   - Should take 15-30 seconds to generate

3. **Test Gallery**
   - Navigate to [http://localhost:3000/gallery](http://localhost:3000/gallery)
   - Should see real jewelry images from Unsplash

4. **Check Console**
   - Open browser DevTools
   - Check for any API errors
   - Verify images are loading from Cloudinary

---

## 🚨 Troubleshooting

### OpenAI Errors
- **401 Unauthorized**: Check your API key is correct
- **429 Rate Limited**: You've exceeded quota or rate limits
- **500 Server Error**: OpenAI service issue, try again later

### Unsplash Errors
- **401 Unauthorized**: Access key is incorrect
- **403 Forbidden**: Check API guidelines acceptance
- **429 Rate Limited**: Exceeded 50 requests/hour on demo

### Cloudinary Errors
- **401 Unauthorized**: API key or secret is incorrect
- **Cloud name not found**: Check cloud name spelling
- **Upload failed**: Check file size limits

---

## 💰 Cost Estimates

### For Development/Testing (10 designs/day)
- **OpenAI**: ~$0.40-0.80/day ($12-24/month)
- **Unsplash**: Free (within limits)
- **Cloudinary**: Free (within limits)
- **Total**: ~$12-24/month

### For Production (100 designs/day)
- **OpenAI**: ~$120-240/month
- **Unsplash**: Apply for production access
- **Cloudinary**: May need paid plan ($99/month+)
- **Total**: ~$220-340/month

---

## 🔒 Security Best Practices

1. **Never commit .env.local** to version control
2. **Rotate keys regularly** (every 90 days)
3. **Set usage limits** on OpenAI dashboard
4. **Use separate keys** for development and production
5. **Monitor usage** to detect anomalies
6. **Restrict API keys** to specific domains in production

---

## 📞 Support Links

- **OpenAI Support**: [help.openai.com](https://help.openai.com)
- **Unsplash Support**: [help.unsplash.com](https://help.unsplash.com)
- **Cloudinary Support**: [support.cloudinary.com](https://support.cloudinary.com)
- **LangSmith Docs**: [docs.smith.langchain.com](https://docs.smith.langchain.com)

---

**Remember**: Keep your API keys secure and never share them publicly!

