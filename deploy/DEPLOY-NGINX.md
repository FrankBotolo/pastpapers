# Deploy on Linux + Nginx

## Requirements

- Ubuntu/Debian VPS (DigitalOcean, Hetzner, Linode, AWS, etc.)
- Domain pointed to your server IP (A record: `@` and `www`)
- SSH access

## 1. Connect to your server

```bash
ssh root@YOUR_SERVER_IP
```

## 2. Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Open `http://YOUR_SERVER_IP` in a browser — you should see the Nginx welcome page.

## 3. Upload your site files

**Option A — From your Windows PC (SCP):**

```powershell
scp -r "C:\Users\HomePC\Desktop\adesence\*" root@YOUR_SERVER_IP:/var/www/malawipastpapers/
```

**Option B — On the server with Git:**

```bash
sudo mkdir -p /var/www/malawipastpapers
sudo chown -R $USER:$USER /var/www/malawipastpapers
git clone YOUR_REPO_URL /var/www/malawipastpapers
```

**Option C — SFTP:** Use FileZilla or WinSCP → upload to `/var/www/malawipastpapers`

### Set permissions

```bash
sudo chown -R www-data:www-data /var/www/malawipastpapers
sudo find /var/www/malawipastpapers -type d -exec chmod 755 {} \;
sudo find /var/www/malawipastpapers -type f -exec chmod 644 {} \;
```

## 4. Configure Nginx

Copy the config from this folder:

```bash
sudo cp /var/www/malawipastpapers/deploy/nginx.conf /etc/nginx/sites-available/malawipastpapers
```

Edit domain name if needed:

```bash
sudo nano /etc/nginx/sites-available/malawipastpapers
```

Enable the site and disable default:

```bash
sudo ln -s /etc/nginx/sites-available/malawipastpapers /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

Visit `http://malawipastpapers.com` — site should load (HTTP only for now).

## 5. Enable HTTPS (Let's Encrypt — free SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d malawipastpapers.com -d www.malawipastpapers.com
```

Follow prompts. Certbot auto-renews. Test:

```bash
sudo certbot renew --dry-run
```

## 6. Firewall (recommended)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

## 7. Verify

- [ ] `https://malawipastpapers.com` loads
- [ ] `/papers/` and `/blog/` work
- [ ] `/privacy-policy.html` loads
- [ ] Mobile layout looks correct
- [ ] Submit sitemap in Google Search Console

## Updating the site

After editing files locally, re-upload:

```powershell
scp -r "C:\Users\HomePC\Desktop\adesence\*" root@YOUR_SERVER_IP:/var/www/malawipastpapers/
```

Or on server with Git:

```bash
cd /var/www/malawipastpapers && git pull
sudo chown -R www-data:www-data .
```

No Nginx restart needed for static HTML changes.

## Optional: serve PDFs

Put PDF files in:

```
/var/www/malawipastpapers/papers/pdf/
```

Link from download pages:

```html
<a href="/papers/pdf/msce-chem-2023.pdf">Download PDF</a>
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| 502 / connection refused | `sudo systemctl status nginx` |
| 403 Forbidden | Check permissions: `www-data` must read files |
| 404 on subpages | Ensure folders exist; check `try_files` in nginx.conf |
| SSL fails | DNS must point to server IP before running certbot |
| Config error | `sudo nginx -t` shows line number |

## Minimal VPS specs

- 1 GB RAM, 1 vCPU — enough for static site + thousands of daily visitors
- ~$4–6/month (Hetzner, DigitalOcean, Vultr)
