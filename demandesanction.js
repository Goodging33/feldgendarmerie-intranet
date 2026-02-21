/* demandesanction.js */
document.addEventListener("DOMContentLoaded",async()=>{currentUser=await window.protegerPage();if(!currentUser)return;const emailElement=document.getElementById("userEmail");if(emailElement){emailElement.textContent=currentUser.email;}console.log("Utilisateur connecté :",currentUser.email);loadSanctions();});async function loadSanctions(){const enAttenteContainer=document.getElementById("rapports-en-attente");const traiteContainer=document.getElementById("rapports-traite-daa");enAttenteContainer.innerHTML=`<div class="loading">Chargement...</div>`;traiteContainer.innerHTML=`<div class="loading">Chargement...</div>`;const{data,error}=await window.supabaseClient.from("sanctions").select("*").order("created_at",{ascending:false});if(error){console.error(error);enAttenteContainer.innerHTML=`<div class="no-rapports">Erreur de chargement.</div>`;traiteContainer.innerHTML=`<div class="no-rapports">Erreur de chargement.</div>`;return;}enAttenteContainer.innerHTML="";traiteContainer.innerHTML="";let countAttente=0;let countTraite=0;data.forEach(sanction=>{const card=createSanctionCard(sanction);if(sanction.demande_daa===false){enAttenteContainer.appendChild(card);countAttente++;}else{traiteContainer.appendChild(card);countTraite++;}});document.getElementById("count-en-attente").textContent=countAttente;document.getElementById("count-traite-daa").textContent=countTraite;if(countAttente===0)enAttenteContainer.innerHTML=`<div class="no-rapports">Aucune demande en attente.</div>`;if(countTraite===0)traiteContainer.innerHTML=`<div class="no-rapports">Aucune demande traitée.</div>`;}function createSanctionCard(sanction){const card=document.createElement("div");card.className="rapport-card";card.innerHTML=`
        <div class="rapport-header">
            <span class="rapport-id">ID : ${sanction.id}</span>
            <span class="rapport-date">${new Date(sanction.created_at).toLocaleString()}</span>
        </div>

        <div class="rapport-info">
            <span class="rapport-label">Nom RP :</span>
            <span class="rapport-value">${sanction.nom_rp || "Inconnu"}</span>
        </div>

        <div class="rapport-info">
            <span class="rapport-label">Grade :</span>
            <span class="rapport-value">${sanction.grade_rp || "Inconnu"}</span>
        </div>

        <div class="rapport-info">
            <span class="rapport-label">Régiment :</span>
            <span class="rapport-value">${sanction.regiment_rp || "Inconnu"}</span>
        </div>

        <div class="rapport-info">
            <span class="rapport-label">SteamID :</span>
            <span class="rapport-value">${sanction.steam_id || "Inconnu"}</span>
        </div>

        <div class="rapport-info">
            <span class="rapport-label">Explication :</span>
            <span class="rapport-value">${sanction.explication || "Aucune explication"}</span>
        </div>

        <div class="rapport-info">
            <span class="rapport-label">Demande de sanction :</span>
            <span class="rapport-value">${sanction.demande_sanction_texte || "Aucun texte"}</span>
        </div>

        <span class="statut-badge ${sanction.demande_daa ? "statut-termine" : "statut-en-attente"}">
            ${sanction.demande_daa ? "Traité" : "Non traité"}
        </span>

        <br><br>
        <button class="btn-modifier-statut">
            ${sanction.demande_daa ? "Marquer comme NON traité" : "Marquer comme TRAITÉ"}
        </button>
    `;card.querySelector(".btn-modifier-statut").addEventListener("click",()=>{toggleSanctionStatus(sanction.id,sanction.demande_daa);});return card;}async function toggleSanctionStatus(id,currentStatus){const newStatus=!currentStatus;const{error}=await window.supabaseClient.from("sanctions").update({demande_daa:newStatus}).eq("id",id);if(error){alert("Erreur lors de la mise à jour.");console.error(error);return;}loadSanctions();}
