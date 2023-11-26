param (
    [string]$stage = $args[0]
)

# Set the temporary directory
$tempDirectory = ".\deploy\LambdaDeploy"
Remove-Item -Path $tempDirectory -Recurse -Force

# Create the temporary directory if it doesn't exist
if (-not (Test-Path -Path $tempDirectory -PathType Container)) {
    New-Item -ItemType Directory -Path $tempDirectory | Out-Null
}

# Clone your repository to the temporary directory
$repositoryUrl = 'https://vedanti-u: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@github.com/vedanti-u/site-backend.git'
git clone $repositoryUrl $tempDirectory

# Change to the cloned directory
cd $tempDirectory

# Install dependencies or perform any necessary setup
# For example, if your project has Node.js dependencies
npm install
cd ..
cd ..

# Run local tests
npm run test-local

# Check if tests passed
if ($LASTEXITCODE -eq 0) {
    # Deploy using Serverless Framework
    npx sls deploy --stage $stage

    # Run tests for the specified stage
    npm run test-$stage
}
else {
    Write-Host "Tests failed. Deployment aborted."
}
Remove-Item -Path $tempDirectory -Recurse -Force
