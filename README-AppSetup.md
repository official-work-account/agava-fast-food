## IN PRODUCTION MODE

1. Create paystack account for client
2. Create a copy of Proshopper for client in github
3. Turn off fields labeled for "FOR DEVELOPMENT" & turn on fields labeled "FOR PRODUCTION MODE" & set "shipping price" & "tax price" in:

- cartUtils.js
- calcPrices.js

4. Turn on code with label "For live mode" in:

- webhookHelper.js
- orderController.js

5. Allow & remove "Test User & Product" data to be deleted
   To do: Search "ifelse statement to be removed in deployment" in the below files, to find relevant code to remove

- userController.js
- productController.js

6. Add webhook URL in paystack account.

7. Remove from OrderScreen.jsx:

- "Test Pay Now" button
- "Use test pay button..." notice

8. Change WhatsApp contact in "OrderOnWhatsAppScreen.jsx" file to that of client

9. Create database for client in my account & seed starting data in database

10. Publish to render in my account

11. Change Logo & favicon

12. Create .env file

13. Make changes to these files in /public:

- manifest.json
- index.html

TO NOTE:

- Each client should be treated as a new project with its own dedicated database on free module.
- image aspect ratio: 4:3
- image size: 640 x 510px || 640 x 480px

Useful definitions:

- Storage - database size,
- RAM - temporary storage for resources (data) currently in use. E.g. when you call orderlist, data currently in use would be list of all orders &
- vCPU (virtual Central Processing Unit) - processes the commands to the database to fetch required data

---

## IN DEVELOPMENT / TEST MODE

1. Turn on fields labeled for "FOR DEVELOPMENT & TEST MODE" in:

- cartUtils.js
- calcPrices.js

2. Turn on code with label "For test mode" in:

- webhookHelper.js
- orderController.js
