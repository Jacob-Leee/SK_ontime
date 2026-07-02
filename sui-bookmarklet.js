// ============================================================
// SK Ontime — SUI Bookmarklet
// 사용법: 아래 한 줄짜리 코드를 북마크 URL에 붙여넣기
// SUI 오더 디테일 페이지에서 클릭 → SK Ontime New Order 자동 입력
// ============================================================

// 아래 한 줄을 복사해서 브라우저 북마크 URL로 저장하세요:
// (북마크 이름 예: "→ SK Ontime")

javascript:(function(){const lines=document.body.innerText.split('\n').map(l=>l.trim()).filter(Boolean);const after=label=>{const i=lines.indexOf(label);return i>=0?lines[i+1]||'':'';};const bodyText=lines.join('\n');const scoM=bodyText.match(/\bSCO-0\d{6,8}\b/);const orderNumber=scoM?scoM[0]:'';const address=after('Facility Address');const prnRaw=after('PRN/FRN')||after('PRN')||after('FRN');const prn=prnRaw.replace(/[^\d]/g,'');const areaRaw=after('Contract Area');const areaM=areaRaw.match(/CA(\d+)/i);const area=areaM?'CA'+areaM[1]:'';const classRaw=after('Work Classification')||after('Work Order Type')||'';let workType='vac';if(/responsive/i.test(classRaw))workType='res';else if(/programmed/i.test(classRaw))workType='pro';const suiM=location.href.match(/sui-work-order\/([^/?#]+)/);const suiId=suiM?suiM[1]:'';const dateRaw=after('Assigned Date/Time')||after('Assigned Date')||'';let orderDate='';const dM=dateRaw.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);if(dM)orderDate=dM[3]+'-'+dM[2].padStart(2,'0')+'-'+dM[1].padStart(2,'0');const ok=confirm('📋 SK Ontime 자동 입력\n\n오더번호: '+orderNumber+'\n주소: '+address+'\nPRN: '+prn+'\nArea: '+area+'\n날짜: '+orderDate+'\n\nOK = SK Ontime 열기');if(!ok)return;const params=new URLSearchParams({suiImport:'1',orderNumber,address,prn,area,workType,suiId,orderDate});window.open('https://jacob-leee.github.io/SK_ontime/?'+params.toString(),'_blank');})();


// ============================================================
// 설치 방법:
// 1. Chrome 북마크바에서 우클릭 → "페이지 추가"
// 2. 이름: → SK Ontime
// 3. URL: 위의 javascript:(...) 한 줄 전체를 붙여넣기
// 4. 저장
//
// 사용 방법:
// SUI 오더 디테일 페이지에서 북마크 클릭
// → 확인창에서 데이터 확인
// → OK 누르면 SK Ontime New Order 모달 자동 오픈
// (SOR 코드만 직접 선택하면 됨)
// ============================================================
