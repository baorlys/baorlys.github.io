export type Lang = 'en' | 'vi'

export const LANG: Lang = document.documentElement.lang === 'vi' ? 'vi' : 'en'

export type Project = {
  id: 'bank' | 'superapp' | 'loyalty'
  name: string
  summary: string
  metric: { value: string; label: string }
  highlights: { title: string; body: string }[]
  stack: string[]
  caseStudy?: { label: string; href: string }
}

export type Milestone = {
  period: string
  title: string
  role: string
  body: string
  current?: boolean
  work?: { label: string; href: string }[]
}

type Copy = {
  nav: { work: string; experience: string; approach: string; resume: string; email: string; switchLabel: string; switchHref: string; switchName: string }
  hero: { eyebrow: string; title: string; sub: string; ctaWork: string; ctaEmail: string }
  projects: Project[]
  experienceTitle: string
  experience: Milestone[]
  approach: {
    title: [string, string, string]
    body: string
    skills: string
    measureTitle: string
    measureBody: string
    splitTitle: string
    splitBody: string
    stack: string
  }
  contact: { title: string; resume: string }
  footer: { owner: string; keysBefore: string; keysAfter: string }
}

const BANK_STACK = ['Java', 'Spring Boot 3', 'PostgreSQL', 'Kafka', 'AWS KMS', 'EKS']
const SUPER_STACK = ['Java 25', 'Spring Boot 4', 'Keycloak', 'Kafka', 'DynamoDB', 'Argo CD']
const LOYAL_STACK = ['Java', 'Spring Boot', 'MariaDB', 'Elasticsearch', 'Docker']

const EN: Copy = {
  nav: { work: 'Work', experience: 'Experience', approach: 'Approach', resume: 'Resume', email: 'Email me', switchLabel: 'VI', switchHref: '/vi/', switchName: 'Tiếng Việt' },
  hero: {
    eyebrow: 'Bao Ly, Backend Engineer',
    title: 'I build the backend that moves money.',
    sub: 'Two years building onboarding and identity backends for a 3-million-customer digital bank and a fintech super app.',
    ctaWork: 'See the work',
    ctaEmail: 'Email me',
  },
  projects: [
    {
      id: 'bank',
      name: 'Digital Bank',
      summary: 'A licensed digital bank with 3 million customers, run by a fintech group. I work in the onboarding and eVoucher teams.',
      metric: { value: '11,000', label: 'customer IDs allocated a day, zero duplicates' },
      highlights: [
        { title: 'CIF allocation', body: 'Per-type pools with Feistel-based IDs, claimed through FOR UPDATE SKIP LOCKED so pods never queue.' },
        { title: 'eVoucher issuance', body: 'One orchestration over two partner APIs, safe to replay under retries and Kafka redelivery.' },
        { title: 'Onboarding session', body: 'KYC, ID card, NFC and face-check evidence in one DynamoDB aggregate, created idempotently.' },
        { title: 'Pool backpressure', body: 'Capped refill batches so a drained pool cannot stampede the database, plus reclaim for crashed pods.' },
      ],
      stack: BANK_STACK,
      caseStudy: { label: 'How the CIF pools work', href: '/work/cif-allocation/' },
    },
    {
      id: 'superapp',
      name: 'Super App',
      summary: 'A consumer super app hosting partner mini-apps under one login. I build the identity and session services.',
      metric: { value: 'Java 25', label: 'onboarding service built from scratch on Spring Boot 4' },
      highlights: [
        { title: 'Challenge chain', body: 'Versioned step-up authentication with assurance floors per customer tier, cached on the hot path.' },
        { title: 'Mini-app access', body: 'A Keycloak SPI that limits which mini-app APIs each client reaches, with a pseudonymous token subject.' },
        { title: 'Onboarding service', body: 'Clean Architecture, Liquibase, Kafka, OpenAPI and WireMock tests, shipped through to staging.' },
        { title: 'Satellite services', body: 'MFA, device management, configuration, partner integration and the BFF for web and mobile.' },
      ],
      stack: SUPER_STACK,
      caseStudy: { label: 'How the challenge chain works', href: '/work/challenge-chain/' },
    },
    {
      id: 'loyalty',
      name: 'Loyalty Platform',
      summary: 'One points and rewards domain shared by F&B chains and healthcare clinics, so members earn in one place and redeem in another.',
      metric: { value: '6-8s', label: 'report exports, down from 20-30s' },
      highlights: [
        { title: 'Points ledger', body: 'Concurrency controls that keep balances correct when one transaction draws on several funding sources.' },
        { title: 'Search sync', body: 'MariaDB to Elasticsearch through a transactional outbox, strictly ordered and with no dual writes.' },
        { title: 'E-invoicing', body: 'A vendor-agnostic signing layer that keeps invoices compliant with tax authority rules.' },
        { title: 'Reporting', body: 'Rewritten queries and lower JVM allocation for the heavy Excel exports merchants run.' },
      ],
      stack: LOYAL_STACK,
    },
  ],
  experienceTitle: 'Experience',
  experience: [
    {
      period: 'Oct 2025 - now',
      title: 'CMC Global',
      role: 'Backend Engineer, on site at a fintech group',
      body: 'Led a three-engineer squad for six months. Rated a top performer by the client.',
      current: true,
      work: [
        { label: 'Digital Bank', href: '#bank' },
        { label: 'Super App', href: '#superapp' },
      ],
    },
    {
      period: 'Jun - Sep 2025',
      title: 'ID Solutions',
      role: 'Software Engineer, contract',
      body: 'Backend for a loyalty platform serving F&B and healthcare merchants.',
      work: [{ label: 'Loyalty Platform', href: '#loyalty' }],
    },
    {
      period: 'May 2024 - Jun 2025',
      title: 'NashTech, bbv Vietnam',
      role: 'Software Engineer Intern, full-time',
      body: 'Multi-tenant digital asset management, RabbitMQ image processing, and a notification service for voice, SMS and email.',
    },
    {
      period: '2020 - 2026',
      title: 'Ton Duc Thang University',
      role: 'B.Eng. Software Engineering',
      body: 'Competed on the ICPC regional team in 2022 and 2023.',
    },
  ],
  approach: {
    title: ['See the whole problem before the ', 'first line', '.'],
    body: 'I work top down: map the flow end to end, find where it can break, then solve one piece at a time. Money and identity flows still get idempotency, clear error codes and tests on real config.',
    skills: 'skills in the Claude Code plugin I wrote for the team. AI takes the first pass on every task, and our conventions run as checks on every change.',
    measureTitle: 'Measure first',
    measureBody: 'The challenge chain got a cache only after profiling showed three queries per start and five per switch.',
    splitTitle: 'Break it down',
    splitBody: 'CIF allocation became four smaller problems: per-type pools, Feistel IDs, SKIP LOCKED claims and capped refills. Each is small enough to reason about and test alone.',
    stack: 'Tech stack',
  },
  contact: { title: 'Building something that has to hold?', resume: 'Resume' },
  footer: { owner: '© 2026 Bao Ly', keysBefore: 'Press', keysAfter: 'to move between sections' },
}

const VI: Copy = {
  nav: { work: 'Dự án', experience: 'Hành trình', approach: 'Cách mình làm', resume: 'CV', email: 'Gửi mail', switchLabel: 'EN', switchHref: '/', switchName: 'English' },
  hero: {
    eyebrow: 'Lý Gia Bảo, Backend Engineer',
    title: 'Mình làm backend để tiền đi đúng chỗ.',
    sub: 'Hai năm làm onboarding và identity cho một ngân hàng số 3 triệu khách, kèm thêm một super app fintech.',
    ctaWork: 'Xem dự án',
    ctaEmail: 'Gửi mail cho mình',
  },
  projects: [
    {
      id: 'bank',
      name: 'Ngân hàng số',
      summary: 'Ngân hàng số có giấy phép hẳn hoi, 3 triệu khách, thuộc một tập đoàn fintech. Mình ở team onboarding và eVoucher.',
      metric: { value: '11.000', label: 'mã khách hàng cấp mỗi ngày, không trùng cái nào' },
      highlights: [
        { title: 'Cấp số CIF', body: 'Mỗi loại khách một pool riêng, số sinh bằng Feistel, lấy ra bằng FOR UPDATE SKIP LOCKED nên các pod không phải xếp hàng.' },
        { title: 'Phát eVoucher', body: 'Một luồng điều phối gom hai API đối tác, retry hay Kafka giao lại bao nhiêu lần thì chạy lại vẫn an toàn.' },
        { title: 'Phiên onboarding', body: 'KYC, giấy tờ tùy thân, NFC và ảnh khuôn mặt gom vào một aggregate DynamoDB, tạo mới kiểu idempotent.' },
        { title: 'Chống dồn tải', body: 'Giới hạn số lô mỗi lần nạp để pool cạn không kéo sập database, thêm job thu hồi khi pod chết giữa chừng.' },
      ],
      stack: BANK_STACK,
      caseStudy: { label: 'Xem pool CIF chạy ra sao', href: '/vi/work/cif-allocation/' },
    },
    {
      id: 'superapp',
      name: 'Super App',
      summary: 'Một app, một lần đăng nhập, cả rổ mini-app đối tác. Mình làm phần identity và session.',
      metric: { value: 'Java 25', label: 'onboarding service dựng từ con số 0 trên Spring Boot 4' },
      highlights: [
        { title: 'Challenge chain', body: 'Xác thực bổ sung (step-up) có version, mỗi hạng khách có mức sàn riêng, đường nóng có cache.' },
        { title: 'Quyền cho mini-app', body: 'Keycloak SPI giới hạn mỗi client chỉ gọi được đúng API mini-app của nó, subject trong token là bí danh.' },
        { title: 'Onboarding service', body: 'Clean Architecture, Liquibase, Kafka, OpenAPI, test bằng WireMock, đưa lên tới tận staging.' },
        { title: 'Các service vệ tinh', body: 'MFA, quản lý thiết bị, cấu hình, tích hợp đối tác và BFF cho cả web lẫn mobile.' },
      ],
      stack: SUPER_STACK,
      caseStudy: { label: 'Xem challenge chain chạy ra sao', href: '/vi/work/challenge-chain/' },
    },
    {
      id: 'loyalty',
      name: 'Nền tảng Loyalty',
      summary: 'Một kho điểm thưởng dùng chung cho chuỗi F&B và phòng khám, tích ở chỗ này rồi đổi ở chỗ kia.',
      metric: { value: '6-8s', label: 'xuất báo cáo, trước đây mất 20-30s' },
      highlights: [
        { title: 'Sổ điểm', body: 'Kiểm soát đồng thời để số dư luôn đúng, kể cả khi một giao dịch trừ từ nhiều nguồn cùng lúc.' },
        { title: 'Đồng bộ tìm kiếm', body: 'Đẩy MariaDB sang Elasticsearch qua transactional outbox, đúng thứ tự, không ghi đôi.' },
        { title: 'Hoá đơn điện tử', body: 'Lớp ký hoá đơn không phụ thuộc nhà cung cấp, luôn đúng quy định của cơ quan thuế.' },
        { title: 'Báo cáo', body: 'Viết lại query, giảm cấp phát bộ nhớ JVM cho mấy file Excel nặng ký mà merchant hay xuất.' },
      ],
      stack: LOYAL_STACK,
    },
  ],
  experienceTitle: 'Hành trình',
  experience: [
    {
      period: '10/2025 - nay',
      title: 'CMC Global',
      role: 'Backend Engineer, làm onsite cho một tập đoàn fintech',
      body: 'Dẫn một squad ba người trong sáu tháng. Được khách hàng xếp vào nhóm làm tốt nhất.',
      current: true,
      work: [
        { label: 'Ngân hàng số', href: '#bank' },
        { label: 'Super App', href: '#superapp' },
      ],
    },
    {
      period: '06 - 09/2025',
      title: 'ID Solutions',
      role: 'Software Engineer, hợp đồng',
      body: 'Làm backend cho nền tảng loyalty phục vụ merchant F&B và y tế.',
      work: [{ label: 'Nền tảng Loyalty', href: '#loyalty' }],
    },
    {
      period: '05/2024 - 06/2025',
      title: 'NashTech, bbv Vietnam',
      role: 'Thực tập sinh Software Engineer, toàn thời gian',
      body: 'Quản lý tài sản số multi-tenant, xử lý ảnh qua RabbitMQ, và một notification service lo đủ gọi thoại, SMS lẫn email.',
    },
    {
      period: '2020 - 2026',
      title: 'Đại học Tôn Đức Thắng',
      role: 'Kỹ sư Kỹ thuật Phần mềm',
      body: 'Đi thi ICPC khu vực năm 2022 và 2023.',
    },
  ],
  approach: {
    title: ['Nhìn hết bài toán rồi mới viết ', 'dòng đầu tiên', '.'],
    body: 'Mình đi từ trên xuống: vẽ cả luồng từ đầu tới cuối, tìm chỗ có thể hỏng, rồi giải từng phần một. Luồng tiền và danh tính vẫn phải có idempotency, mã lỗi rõ ràng và test trên config thật.',
    skills: 'skill trong plugin Claude Code mình viết cho team. Việc nào AI cũng làm lượt đầu, còn quy ước của team thành bước kiểm tra tự chạy mỗi lần sửa code.',
    measureTitle: 'Đo trước, sửa sau',
    measureBody: 'Challenge chain chỉ được thêm cache sau khi profiling thấy mỗi lần start tốn ba query, mỗi lần switch tốn năm.',
    splitTitle: 'Chia nhỏ bài toán',
    splitBody: 'Cấp số CIF được tách thành bốn bài nhỏ: pool theo loại khách, sinh số bằng Feistel, lấy số bằng SKIP LOCKED, nạp lại có giới hạn. Bài nào cũng đủ nhỏ để nghĩ cho thấu và test riêng.',
    stack: 'Công nghệ',
  },
  contact: { title: 'Đang xây thứ gì đó không được phép sập?', resume: 'CV' },
  footer: { owner: '© 2026 Lý Gia Bảo', keysBefore: 'Bấm', keysAfter: 'để nhảy qua lại giữa các phần' },
}

export const COPY = LANG === 'vi' ? VI : EN
