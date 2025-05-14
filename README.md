# IT-tjenester i Windows Server-miljø - drift_termin

Dette lageret inneholder dokumentasjon og potensielt skript relatert til oppsett og administrasjon av ulike IT-tjenester i et Windows Server-miljø. Det dekker konfigurasjon av essensielle tjenester som DHCP, Active Directory Domain Services (AD DS), VLAN, Hyper-V, IIS, Windows Deployment Services (WDS) og Microsoft Deployment Toolkit (MDT).

Målet med denne dokumentasjonen er å gi en oversikt over de nødvendige komponentene og konfigurasjonstrinnene for hver tjeneste, med fokus på hva som kreves for å ha tjenesten på plass og funksjonell.

## Innholdsfortegnelse

- [DHCP (Dynamic Host Configuration Protocol)](#dhcp-dynamic-host-configuration-protocol)
- [Active Directory Domain Services (AD DS)](#active-directory-domain-services-ad-ds)
- [VLAN-konfigurasjon](#vlan-konfigurasjon)
- [Hyper-V Virtualisering](#hyper-v-virtualisering)
- [IIS (Internet Information Services)](#iis-internet-information-services)
- [Windows Deployment Services (WDS)](#windows-deployment-services-wds)
- [Microsoft Deployment Toolkit (MDT)](#microsoft-deployment-toolkit-mdt)

## DHCP (Dynamic Host Configuration Protocol)

For å sette opp og konfigurere en DHCP-server i et Windows Server-miljø ved hjelp av PowerShell, må du:

* **Ha DHCP-serverrollen installert:** Dette kan gjøres ved hjelp av følgende PowerShell-kommando. Du kan bekrefte installasjonen med `Get-WindowsFeature DHCP`.
    ```powershell
    Install-WindowsFeature -Name DHCP -IncludeAllSubFeature -includeManagementTools
    ``` 
* **Opprette og konfigurere et nytt scope:** Definer et område med IP-adresser som DHCP-serveren vil leie ut til klienter. Dette innebærer å spesifisere et navn, start- og slutt-IP-adresser, nettverksmaske, og sette scopet til aktivt.
    ```powershell
    Add-DhcpServerV4Scope -Name "scope navn" -StartRange din start ip adresse -EndRange din slutt ip-adresse -SubnetMask 255.255.255.0 -State Active
    ``` 
* **Konfigurere standard gateway og DNS-serveralternativer:** Sett standard gateway og DNS-serveradresser som klienter vil motta fra DHCP-serveren.
    ```powershell
    Set-DhcpServerV4OptionValue -ScopeId 192.168.9.1 -OptionId 3 -Value 192.168.9.7
    ```

* **Aktivere og starte DHCP-tjenesten:** Sørg for at tjenesten er satt til å starte automatisk og kjører.
    ```powershell
    Set-Service -Name DHCPServer -StartupType Automatic
    Restart-Service -Name DHCPServer
    ``` 
* **Definere IP-adresseeksklusjonsområder (valgfritt, men anbefalt):** Spesifiser et område med IP-adresser innenfor scopet som ikke skal tildeles av DHCP-serveren, vanligvis for statiske tildelinger.
    ```powershell
    Add-DhcpServerV4ExclusionRange -ScopeId 192.168.9.1 -StartRange 192.168.9.1 -EndRange 192.168.9.50
    ``` 

## Active Directory Domain Services (AD DS)

For å sette opp og konfigurere en domenekontroller med AD DS ved hjelp av PowerShell, må du:

* **Ha AD-Domain-Services-rollen installert:** Installer den nødvendige rollen ved hjelp av følgende PowerShell-kommando. Bekreft installasjonen med `Get-WindowsFeature AD-Domain-Services`.
    ```powershell
    Install-WindowsFeature -Name AD-Domain-Services -IncludeAllSubFeature -includeManagementTools
    ``` 
* **Opprette en ny forest og installere DNS:** Promover serveren til en domenekontroller og opprett en ny AD forest, som inkluderer installasjon av DNS-serverrollen. Dette gjøres ved hjelp av `Install-ADDSForest` cmdlet, der du angir domenenavn, NetBIOS-navn og et sikkert passord for administrator i sikkermodus. Serveren vil starte på nytt for å fullføre prosessen.
    ```powershell
    $domain_navn = "hmehq.dm"
    $netbiosnavn = "hmemq"
    $passord = Read-Host "skriv inn passord" -AsSecureString
    Install-ADDSForest -DomainName $domain_navn -DomainNetbiosName $netbiosnavn -SafeModeAdministratorPassword $passord -InstallDns -Force
    ``` 

## VLAN-konfigurasjon

Konfigurering av VLAN på en Windows Server innebærer vanligvis følgende for å ha det på plass:

* **Støtte for nettverkskort og svitsj:** Sørg for at nettverkskortet (NIC) og nettverkssvitsjen støtter IEEE 802.1q for VLAN-merking.
* **VLAN ID-konfigurasjon:** Konfigurer den spesifikke VLAN ID-en på nettverkskortet eller NIC-team-grensesnittet. Dette kan ofte gjøres via nettverkskortets avanserte egenskaper i Enhetsbehandling eller innenfor NIC Teaming-konfigurasjonsgrensesnittet i Server Manager.
* **IP-adresse tildeling:** Tilordne en IP-adresse og nettverksmaske til VLAN-grensesnittet som samsvarer med VLAN-nettverket.
* **Svitsjkonfigurasjon:** Nettverkssvitsjportene som er koblet til serveren må konfigureres for å tillate de spesifiserte VLAN-ene.

## Hyper-V Virtualisering

For å ha Hyper-V virtualisering i et Windows Server-miljø, må du:

* **Oppfylle forutsetninger:** Servermaskinvaren må støtte virtualisering og ha det aktivert i BIOS/UEFI. Operativsystemet må være en versjon av Windows Server som inkluderer Hyper-V-rollen.
* **Installere Hyper-V-rollen:** Legg til Hyper-V-serverrollen via Server Manager eller ved hjelp av PowerShell (`Install-WindowsFeature -Name Hyper-V -IncludeAllSubFeature -Restart` for Server Core eller `Add-WindowsFeature rsat-Hyper-V-tools` for administrasjonsverktøy).
* **Installere Hyper-V-administrasjonsverktøy (valgfritt):** Installer Hyper-V Manager-konsollen for å administrere virtuelle maskiner. Dette er vanligvis inkludert når rollen installeres, men kan installeres separat.
* **Konfigurere virtuelle svitsjer:** Opprett virtuelle svitsjer for å koble virtuelle maskiner til det fysiske nettverket eller for å opprette isolerte interne nettverk. Dette er et viktig konfigurasjonstrinn etter installasjon av rollen.
* **Opprette og konfigurere virtuelle maskiner:** Definer den virtuelle maskinens maskinvareressurser (CPU, minne, lagring, nettverk) og installer et operativsystem.

## IIS (Internet Information Services)

For å sette opp og konfigurere IIS som en webserver på Windows Server, må du:

* **Ha Web Server (IIS)-rollen installert:** Legg til IIS-rollen via Server Manager. Dette kan gjøres ved hjelp av "Add Roles and Features"-veiviseren.
* **Installere nødvendige rolletjenester:** Velg de nødvendige IIS-komponentene og -tjenestene basert på typene webapplikasjoner du planlegger å hoste (f.eks. statisk innhold, ASP.NET, FTP).
* **Åpne IIS Manager:** Åpne IIS Manager fra Server Managers "Tools"-meny for å utføre ytterligere konfigurasjon.
* **Opprette nettsteder:** Definer nye nettsteder i IIS Manager, spesifiser den fysiske banen til nettstedfilene og konfigurer bindinger (IP-adresse, port, vertsnavn).
* **Konfigurere SSL/TLS (for HTTPS):** Hvis sikker kommunikasjon kreves, konfigurer SSL-bindinger og installer SSL-sertifikater.
* **Sette tillatelser:** Sørg for at identiteten til applikasjonspoolen har de nødvendige tillatelsene til å få tilgang til nettstedets innholdsmappe.

## Windows Deployment Services (WDS)

For å implementere en løsning for distribusjon av operativsystemer ved hjelp av WDS, må du:

* **Ha Windows Deployment Services-rollen installert:** Legg til WDS-rollen via Server Manager. Dette inkluderer både Deployment Server og Transport Server rolletjenester.
* **Ha Active Directory Domain Services:** WDS integreres ofte med Active Directory for administrasjon av klientdatamaskiner og distribusjonsinnstillinger.
* **Ha en DHCP-server:** En DHCP-server er nødvendig for å tildele IP-adresser til klientdatamaskiner som starter via PXE (Preboot Execution Environment). Hvis WDS og DHCP er på samme server, kan ytterligere konfigurasjon være nødvendig.
* **Konfigurere WDS-serveren:** Konfigurer WDS-serveren, spesifiser plasseringen for mappen for fjerninstallasjon og hvordan serveren skal svare på klientdatamaskiner (kjente, ukjente eller alle).
* **Legge til boot- og installasjonsbilder:** Legg til boot-bilder (vanligvis Windows PE) og installasjonsbilder (operativsystembilder) på WDS-serveren. Disse bildene brukes til å starte klientdatamaskiner og distribuere operativsystemet.

## Microsoft Deployment Toolkit (MDT)

MDT brukes i forbindelse med WDS for å gi en mer automatisert og tilpassbar distribusjonsprosess. For å ha MDT på plass for et "tanking" system, må du:

* **Installere nødvendige forutsetninger:** Dette inkluderer Windows Assessment and Deployment Kit (ADK) og Windows PE-tillegget for ADK.
* **Installere Microsoft Deployment Toolkit:** Last ned og installer MDT-applikasjonen.
* **Opprette en deployment share:** Bruk Deployment Workbench (MDT-konsollen) til å opprette en deployment share, som er en nettverksressurs som inneholder alle installasjonsfiler, drivere, applikasjoner og oppgavesekvenser.
* **Befolke deployment share:** Importer operativsystembilder, drivere, applikasjoner og pakker til deployment share.
* **Opprette oppgavesekvenser:** Definer oppgavesekvenser som automatiserer trinnene involvert i distribusjon av et operativsystem, inkludert installasjon av OS, drivere, applikasjoner og domenetilslutning.
* **Integrere med WDS:** Konfigurer WDS til å bruke boot-bildene generert av MDT, slik at klientdatamaskiner kan starte opp i MDT-miljøet via PXE og starte distribusjonsprosessen.

