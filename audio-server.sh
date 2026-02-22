#!/bin/bash
# Static audio file server on port 8787
cd /home/admin/.openclaw/workspace/toefl-repeat/public/audio
python3 -c "
from http.server import HTTPServer, SimpleHTTPRequestHandler
class CORSHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Range')
        self.send_header('Access-Control-Expose-Headers', 'Content-Length, Content-Range')
        super().end_headers()
HTTPServer(('0.0.0.0', 8787), CORSHandler).serve_forever()
"
