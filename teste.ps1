# call-function.ps1

# URL da função
$uri = "https://exxhwjhreanpdnawlbsz.supabase.co/functions/v1/quick-action"

# Cabeçalhos
$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4eGh3amhyZWFucGRuYXdsYnN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODkwNjYsImV4cCI6MjA3MDY2NTA2Nn0.Z5OGMH6A43YMQFFSprh__2KObGjm70UmWz9BV7JEmOc"
    "Content-Type"  = "application/json"
}

# Corpo da requisição (se precisar)
$body = @{
    name = "Functions"
} | ConvertTo-Json

# Faz a requisição
$response = Invoke-RestMethod `
    -Uri $uri `
    -Method Post `
    -Headers $headers `
    -Body $body

# Converte a resposta para JSON e salva no arquivo
$response | ConvertTo-Json -Depth 10 | Out-File -FilePath "response.json" -Encoding utf8

Write-Host "Resposta salva em response.json"
