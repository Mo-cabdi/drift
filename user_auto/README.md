# Opprette Active Directory-brukere fra CSV

Dette skriptet importerer brukerdata fra en CSV-fil og oppretter tilsvarende brukerkontoer i Active Directory.

## Importere Active Directory-modulen

```powershell
Import-Module ActiveDirectory

$csvPath = "C:\Users\Administrator\Documents\brukere.csv"
$users = Import-Csv -Path $csvPath
foreach ($user in $users) {
    # Definere brukerkontoegenskaper
    $firstName = $user.FirstName
    $lastName = $user.LastName
    $userName = $user.UserName
    $password = $user.Password
    $ou = $user.OU
   
    # Opprette brukerkonto
    New-ADUser -GivenName $firstName `
               -Surname $lastName `
               -Name "$firstName $lastName" `
               -SamAccountName $userName `
               -UserPrincipalname "$userName@example.com" `
               -AccountPassword (ConvertTo-SecureString $password -AsPlainText -Force) `
               -Path $ou `
               -Enabled $true `
               -PassThru
}
