/* incident.js */
(function(){const supabase=window.supabaseClient;document.addEventListener('DOMContentLoaded',async()=>{const user=await window.protegerPage();if(!user)return;const emailElement=document.getElementById('userEmail');if(emailElement){emailElement.textContent=user.email;}await chargerTousLesRapports();});function formaterDate(dateISO){const date=new Date(dateISO);const options={year:'numeric',month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'};return date.toLocaleDateString('fr-FR',options);}function creerCarteRapport(rapport){const card=document.createElement('div');card.className='rapport-card';card.onclick=()=>ouvrirRapport(rapport.ticket_id);let badgeClass='statut-en-attente';if(rapport.statut==='Traité D.A.A'){badgeClass='statut-traite-daa';}else if(rapport.statut==='Traité'){badgeClass='statut-termine';}else if(rapport.statut!=='En attente'){badgeClass='statut-dgji';}card.innerHTML=`
            <div class="rapport-header">
                <div class="rapport-id">#${rapport.ticket_id}</div>
                <div class="rapport-date">${formaterDate(rapport.date_creation)}</div>
            </div>

            <div class="rapport-info">
                <span class="rapport-label">👤 Auteur:</span>
                <div class="rapport-value">${rapport.nom_prenom_auteur} - ${rapport.grade_auteur}</div>
                <div class="rapport-value" style="font-size: 12px; color: rgb(158, 158, 158);">${rapport.regiment_auteur}</div>
            </div>

            <div class="rapport-info">
                <span class="rapport-label">⚠️ Mise en cause:</span>
                <div class="rapport-value">${rapport.nom_prenom_mise_en_cause} - ${rapport.grade_mise_en_cause}</div>
                <div class="rapport-value" style="font-size: 12px; color: rgb(158, 158, 158);">${rapport.regiment_mise_en_cause}</div>
            </div>

            <div class="rapport-contenu">
                ${rapport.contenu.substring(0, 100)}${rapport.contenu.length > 100 ? '...' : ''}
            </div>

            <span class="statut-badge ${badgeClass}">${rapport.statut}</span>
        `;return card;}function ouvrirRapport(ticketId){window.location.href=`detail-incident.html?id=${ticketId}`;}function afficherRapports(rapports,containerId,countId){const container=document.getElementById(containerId);const countElement=document.getElementById(countId);countElement.textContent=rapports.length;container.innerHTML='';if(rapports.length===0){container.innerHTML='<div class="no-rapports">Aucun rapport dans cette catégorie</div>';return;}rapports.forEach(rapport=>{const card=creerCarteRapport(rapport);container.appendChild(card);});}async function chargerTousLesRapports(){try{const{data:rapports,error}=await supabase.from('incidents').select('*').order('date_creation',{ascending:false});if(error){console.error('Erreur lors du chargement des rapports:',error);alert('❌ Erreur lors du chargement des rapports');return;}const enAttente=rapports.filter(r=>r.statut==='En attente');const traiteDaa=rapports.filter(r=>r.statut==='Traité D.A.A');const termine=rapports.filter(r=>r.statut==='Traité');const dgji=rapports.filter(r=>r.statut!=='En attente'&&r.statut!=='Traité D.A.A'&&r.statut!=='Traité');afficherRapports(enAttente,'rapports-en-attente','count-en-attente');afficherRapports(traiteDaa,'rapports-traite-daa','count-traite-daa');afficherRapports(dgji,'rapports-dgji','count-dgji');afficherRapports(termine,'rapports-termine','count-termine');}catch(error){console.error('Erreur:',error);alert('❌ Une erreur est survenue lors du chargement des rapports');}}window.rechargerRapports=chargerTousLesRapports;})();
