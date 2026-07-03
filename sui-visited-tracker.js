// ============================================================
// SK Ontime — SUI Visited Row Tracker
// SUI 리스트에서 클릭한 행을 시각적으로 표시
// 새로고침하면 자동 초기화 (in-memory only)
//
// 설치 방법:
// 1. Chrome 북마크바 우클릭 → 페이지 추가
// 2. 이름: ✓ SUI Track
// 3. URL: 아래 javascript: 한 줄 전체 붙여넣기
// ============================================================

javascript:(function(){
  if(window._suiVisitTrack){
    var reset=confirm('방문 추적 중입니다.\nOK = 표시 초기화 | Cancel = 유지');
    if(reset){
      document.querySelectorAll('[data-sui-visited]').forEach(function(el){
        el.removeAttribute('style');
        el.removeAttribute('data-sui-visited');
        var tick=el.querySelector('._sui_tick');
        if(tick)tick.remove();
      });
      window._suiVisitTrack=false;
      var b=document.getElementById('_sui_badge');
      if(b)b.remove();
    }
    return;
  }
  window._suiVisitTrack=true;
  var visitedCount=0;

  function markRow(link){
    // Walk up to find the table row or list row container
    var row=link.closest('tr')||link.closest('li')||link.closest('[class*="row"]')||link.parentElement.parentElement;
    if(!row||row.dataset.suiVisited)return;
    row.dataset.suiVisited='1';
    row.style.cssText+='opacity:0.42!important;background:rgba(0,0,0,0.06)!important;';
    // Grey + strikethrough on the link itself
    link.style.cssText+='color:#9CA3AF!important;text-decoration:line-through!important;';
    // Add tick before link text
    if(!link.querySelector('._sui_tick')){
      var tick=document.createElement('span');
      tick.className='_sui_tick';
      tick.textContent='✓ ';
      tick.style.cssText='color:#10B981;font-weight:700;font-size:12px;';
      link.insertBefore(tick,link.firstChild);
    }
    visitedCount++;
    updateBadge();
  }

  function attachListeners(){
    document.querySelectorAll('a').forEach(function(a){
      if(a._suiTrackBound)return;
      if(!/SCO-|SC0-/i.test(a.textContent+a.getAttribute('href')))return;
      a._suiTrackBound=true;
      a.addEventListener('click',function(){markRow(a);});
    });
  }

  attachListeners();

  // Watch for dynamic content (pagination, lazy load)
  var obs=new MutationObserver(attachListeners);
  obs.observe(document.body,{childList:true,subtree:true});

  // Floating badge
  function updateBadge(){
    var b=document.getElementById('_sui_badge');
    if(b)b.textContent='✓ '+visitedCount+' checked';
  }
  var badge=document.createElement('div');
  badge.id='_sui_badge';
  badge.textContent='✓ 0 checked';
  badge.title='북마클릿 다시 클릭하면 초기화';
  badge.style.cssText='position:fixed;bottom:20px;right:16px;z-index:999999;'
    +'background:#1F2937;color:#fff;padding:8px 16px;border-radius:20px;'
    +'font-size:13px;font-weight:700;box-shadow:0 2px 10px rgba(0,0,0,0.35);'
    +'cursor:default;user-select:none;';
  document.body.appendChild(badge);

  var totalLinks=document.querySelectorAll('a').length;
  console.log('[SUI Tracker] Active');
})();


// ============================================================
// 동작 방식:
// - 북마클릿 클릭 → 페이지의 SCO 링크에 클릭 리스너 부착
// - SCO 링크 클릭 → 해당 행 흐리게 + ✓ 표시
// - 우측 하단 배지에 몇 개 확인했는지 카운트 표시
// - 새로고침 → 완전 초기화 (브라우저 메모리에만 저장)
// - 북마클릿 재클릭 → 초기화 여부 묻는 팝업
// ============================================================
