import hashlib

def hash_senha(senha):
    senha_bytes = senha.encode('utf-8')
    
    hash_obj = hashlib.sha256(senha_bytes)
    
    return hash_obj.hexdigest()

senha = "Teste@123"
hash_resultado = hash_senha(senha)

print(f"Senha original: {senha}")
print(f"Hash SHA256: {hash_resultado}")