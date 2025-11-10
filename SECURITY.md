# Security Best Practices

## ⚠️ IMPORTANT: About the Example Credentials

### GitGuardian Alert Explanation

If GitGuardian flagged passwords in this repository, **that's expected**. Here's why:

**Files with example credentials (SAFE):**

- `.env.example` - Template file, never contains real secrets
- `docker-compose.yml` - Uses environment variables with safe defaults
- `*.md` documentation files - Contains example passwords for local development
- `setup.sh` - Automation script for local setup

**These are NOT production credentials** - they are:

- Used only for local development
- Documented in public tutorials
- Never used in production environments
- Safe fallback values when `.env` is missing

### ✅ What's Already Secure

1. **No real secrets in git**: The `.gitignore` file excludes all `.env` files
2. **Environment-based config**: All services read from environment variables
3. **Example files only**: All committed files are `.example` templates

### 🔒 Production Security Checklist

When deploying to production, you MUST:

#### 1. Generate Strong Passwords

```bash
# Generate secure random passwords
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 24  # For database passwords
```

#### 2. Use Secrets Management

**Option A: Cloud Provider Secrets**

```bash
# AWS Secrets Manager
aws secretsmanager create-secret --name food-delivery/postgres-password --secret-string "STRONG_PASSWORD"

# Google Cloud Secret Manager
gcloud secrets create postgres-password --data-file=-

# Azure Key Vault
az keyvault secret set --vault-name MyKeyVault --name postgres-password --value "STRONG_PASSWORD"
```

**Option B: HashiCorp Vault**

```bash
vault kv put secret/food-delivery \
  postgres_password="STRONG_PASSWORD" \
  mongo_password="STRONG_PASSWORD" \
  rabbitmq_password="STRONG_PASSWORD" \
  jwt_secret="STRONG_SECRET"
```

**Option C: Kubernetes Secrets**

```bash
kubectl create secret generic food-delivery-secrets \
  --from-literal=postgres-password=STRONG_PASSWORD \
  --from-literal=mongo-password=STRONG_PASSWORD \
  --from-literal=rabbitmq-password=STRONG_PASSWORD \
  --from-literal=jwt-secret=STRONG_SECRET
```

#### 3. Update docker-compose for Production

Create `docker-compose.prod.yml`:

```yaml
version: "3.8"

services:
  postgres:
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
    secrets:
      - postgres_password

  mongodb:
    environment:
      MONGO_INITDB_ROOT_PASSWORD_FILE: /run/secrets/mongo_password
    secrets:
      - mongo_password

secrets:
  postgres_password:
    external: true
  mongo_password:
    external: true
```

#### 4. Rotate Credentials Regularly

```bash
# Schedule for credential rotation
- Initial deployment: Strong unique passwords
- Every 90 days: Rotate all passwords
- Immediately: If compromise suspected
- Annually: Rotate JWT secrets
```

#### 5. Use Password Complexity Requirements

**Minimum standards:**

- Length: 32+ characters
- Mix: uppercase, lowercase, numbers, symbols
- Unique: Different password per service
- Random: Use cryptographic random generator

**Bad examples (like our dev defaults):**

```
❌ admin123
❌ password
❌ fooddelivery123
❌ your-secret-key
```

**Good examples:**

```
✅ kR9$mN2@pL5#wQ8^vX4&zT7!
✅ Use a password manager
✅ Use cloud secrets manager
✅ Generate with: openssl rand -base64 32
```

### 🛡️ Additional Security Measures

#### 1. Network Security

```yaml
# In docker-compose.prod.yml
networks:
  backend:
    driver: bridge
    internal: true # Services not exposed to internet
  frontend:
    driver: bridge

services:
  api-gateway:
    networks:
      - frontend
      - backend

  postgres:
    networks:
      - backend # Database not directly accessible
```

#### 2. Enable SSL/TLS

```javascript
// In production, enforce HTTPS
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});
```

#### 3. Add Rate Limiting

```javascript
// Already included in API Gateway
// Configure per environment:

// Development
windowMs: 15 * 60 * 1000,  // 15 minutes
max: 1000  // 1000 requests

// Production
windowMs: 15 * 60 * 1000,  // 15 minutes
max: 100  // 100 requests per IP
```

#### 4. Database Connection Security

```javascript
// Use SSL for database connections in production
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("/path/to/ca-certificate.crt").toString(),
  },
});
```

#### 5. JWT Configuration

```javascript
// Strong JWT configuration
const jwt = require("jsonwebtoken");

// Sign tokens
jwt.sign(payload, process.env.JWT_SECRET, {
  algorithm: "HS256",
  expiresIn: "15m", // Short expiration
  issuer: "food-delivery-api",
  audience: "food-delivery-client",
});

// Verify tokens
jwt.verify(token, process.env.JWT_SECRET, {
  algorithms: ["HS256"],
  issuer: "food-delivery-api",
  audience: "food-delivery-client",
});
```

### 📋 Pre-Production Security Checklist

Before deploying to production:

- [ ] All passwords changed from defaults
- [ ] Secrets stored in secrets manager
- [ ] No hardcoded credentials in code
- [ ] `.env` files added to `.gitignore`
- [ ] SSL/TLS enabled for all connections
- [ ] Database connections use SSL
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] XSS protection enabled
- [ ] Security headers configured (helmet.js)
- [ ] Error messages don't leak information
- [ ] Logging doesn't capture sensitive data
- [ ] Dependencies scanned for vulnerabilities
- [ ] Penetration testing completed
- [ ] Incident response plan documented

### 🔍 Scanning for Secrets

**Before committing:**

```bash
# Install git-secrets
brew install git-secrets

# Setup for repository
cd /path/to/repo
git secrets --install
git secrets --register-aws

# Scan repository
git secrets --scan

# Scan specific files
git secrets --scan path/to/file
```

**Pre-commit hook:**

```bash
# .git/hooks/pre-commit
#!/bin/bash

# Check for potential secrets
if git diff --cached | grep -i "password\|secret\|api_key" | grep -v ".example"; then
  echo "⚠️  WARNING: Potential secret detected in commit!"
  echo "Review your changes and ensure no real secrets are committed."
  exit 1
fi
```

### 📚 Environment-Specific Configuration

#### Development (Local)

```bash
# .env.development
POSTGRES_PASSWORD=dev_password_12345
MONGO_PASSWORD=dev_mongo_12345
RABBITMQ_PASSWORD=dev_rabbit_12345
JWT_SECRET=dev_jwt_secret_key_not_for_production
```

#### Staging

```bash
# Loaded from AWS Secrets Manager
POSTGRES_PASSWORD=<from-secrets-manager>
MONGO_PASSWORD=<from-secrets-manager>
RABBITMQ_PASSWORD=<from-secrets-manager>
JWT_SECRET=<from-secrets-manager>
```

#### Production

```bash
# Loaded from production secrets manager
# NEVER stored in files
# Rotated every 90 days
# Monitored for unauthorized access
```

### 🚨 What to Do If Credentials Are Exposed

1. **Immediately rotate all credentials**
2. **Revoke the exposed secrets**
3. **Check access logs for unauthorized use**
4. **Remove secrets from git history:**

```bash
# Use BFG Repo-Cleaner
brew install bfg
bfg --replace-text passwords.txt repo.git

# Or use git-filter-repo
pip install git-filter-repo
git filter-repo --path .env --invert-paths

# Force push (CAUTION: coordinate with team)
git push --force --all
```

5. **Notify your team**
6. **Document the incident**
7. **Review and improve security practices**

### 🎓 Learning Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [GitGuardian Best Practices](https://www.gitguardian.com/secrets-detection)
- [12 Factor App - Config](https://12factor.net/config)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

### 💡 Key Takeaway

**Development vs Production:**

- **Development**: Example passwords are okay (documented, local only)
- **Production**: Must use strong, unique, managed secrets

**This repository is secure for development and learning.**
**You are responsible for security when deploying to production.**

---

## Quick Security Setup for Production

```bash
# 1. Generate strong secrets
export JWT_SECRET=$(openssl rand -base64 32)
export POSTGRES_PASSWORD=$(openssl rand -base64 24)
export MONGO_PASSWORD=$(openssl rand -base64 24)
export RABBITMQ_PASSWORD=$(openssl rand -base64 24)

# 2. Store in cloud secrets manager
# (Choose your cloud provider)

# 3. Update deployment to use secrets
# (Use Kubernetes secrets, Docker secrets, or cloud-specific solutions)

# 4. Never commit .env files
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore
```

---

**Remember:** Security is not a one-time task, it's an ongoing process. Stay vigilant! 🛡️
