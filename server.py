import http.server
import socketserver
import socket

PORT = 8000

# Yerel IP adresini bul
def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

Handler = http.server.SimpleHTTPRequestHandler

# Sunucuyu başlat
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    ip = get_ip()
    print(f"\n--- SUNUCU AKTİF ---")
    print(f"Bilgisayardan erişim: http://localhost:{PORT}")
    print(f"Telefondan erişim:    http://{ip}:{PORT}")
    print("--------------------\n")
    print("Durdurmak için CTRL+C yapın.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nSunucu durduruldu.")