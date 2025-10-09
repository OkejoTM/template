import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const devDirectionDefs = [
  { rawName: 'mobile_apps', durationDays: 0, imagePath: 'icons/android-sketched-logo.png' },
  { rawName: 'web_dev', durationDays: 0, imagePath: 'icons/webnew.png' },
  { rawName: 'desktop_solutions', durationDays: 0, imagePath: 'icons/computer.png' },
  { rawName: 'ui_ux_design', durationDays: 0, imagePath: 'icons/art-and-design.png' },
  { rawName: 'iot', durationDays: 0, imagePath: 'icons/iot.png' },
  { rawName: 'rd', durationDays: 0, imagePath: 'icons/study.png' },
];


// Динамические переводы
const dynamicTranslations = [
  // Переводы направлений разработки

  // Названия
  { section: 'devdirections', rawName: 'mobile_apps', localeCode: 'ru', content: 'Мобильные приложения' },
  { section: 'devdirections', rawName: 'mobile_apps', localeCode: 'en', content: 'Mobile Applications' },

  { section: 'devdirections', rawName: 'web_dev', localeCode: 'ru', content: 'WEB разработка' },
  { section: 'devdirections', rawName: 'web_dev', localeCode: 'en', content: 'WEB Development' },

  { section: 'devdirections', rawName: 'qa_testing', localeCode: 'ru', content: 'QA и тестирование' },
  { section: 'devdirections', rawName: 'qa_testing', localeCode: 'en', content: 'QA and Testing' },

  { section: 'devdirections', rawName: 'ui_ux_design', localeCode: 'ru', content: 'UI/UX-дизайн' },
  { section: 'devdirections', rawName: 'ui_ux_design', localeCode: 'en', content: 'UI/UX Design' },

  { section: 'devdirections', rawName: 'desktop_solutions', localeCode: 'ru', content: 'Десктопные решения' },
  { section: 'devdirections', rawName: 'desktop_solutions', localeCode: 'en', content: 'Desktop Solutions' },

  { section: 'devdirections', rawName: 'software_design', localeCode: 'ru', content: 'Проектирование ПО' },
  { section: 'devdirections', rawName: 'software_design', localeCode: 'en', content: 'Software Design' },

  { section: 'devdirections', rawName: 'iot', localeCode: 'ru', content: 'Интернет вещей (IoT)' },
  { section: 'devdirections', rawName: 'iot', localeCode: 'en', content: 'Internet of Things (IoT)' },

  { section: 'devdirections', rawName: 'rd', localeCode: 'ru', content: 'Исследования (R&D)' },
  { section: 'devdirections', rawName: 'rd', localeCode: 'en', content: 'Research (R&D)' },

  // Описания
  { section: 'devdirections_description', rawName: 'mobile_apps', localeCode: 'ru', content: 'Разработка нативных и кроссплатформенных решении для iOS и Android.' },
  { section: 'devdirections_description', rawName: 'mobile_apps', localeCode: 'en', content: 'Development of native and cross-platform solutions for iOS and Android.' },

  { section: 'devdirections_description', rawName: 'web_dev', localeCode: 'ru', content: 'Создание адаптивных сайтов и веб-приложений для любых устройств.' },
  { section: 'devdirections_description', rawName: 'web_dev', localeCode: 'en', content: 'Building responsive websites and web applications for all devices.' },

  { section: 'devdirections_description', rawName: 'qa_testing', localeCode: 'ru', content: 'Обеспечение качества и тестирование программных решений.' },
  { section: 'devdirections_description', rawName: 'qa_testing', localeCode: 'en', content: 'Ensuring quality and testing software solutions.' },

  { section: 'devdirections_description', rawName: 'ui_ux_design', localeCode: 'ru', content: 'Проектирование и создание удобных и эстетичных интерфейсов.' },
  { section: 'devdirections_description', rawName: 'ui_ux_design', localeCode: 'en', content: 'Designing and creating user-friendly and aesthetic interfaces.' },

  { section: 'devdirections_description', rawName: 'desktop_solutions', localeCode: 'ru', content: 'Разработка под Windows, macOS и Linux. Индивидуальные решения под ваши задачи.' },
  { section: 'devdirections_description', rawName: 'desktop_solutions', localeCode: 'en', content: 'Development for Windows, macOS, and Linux. Custom solutions for your needs.' },

  { section: 'devdirections_description', rawName: 'software_design', localeCode: 'ru', content: 'Создание архитектуры и проектирование программных решений.' },
  { section: 'devdirections_description', rawName: 'software_design', localeCode: 'en', content: 'Creating architecture and designing software solutions.' },

  { section: 'devdirections_description', rawName: 'iot', localeCode: 'ru', content: 'Разработка нативных и кроссплатформенных приложений.' },
  { section: 'devdirections_description', rawName: 'iot', localeCode: 'en', content: 'Development of native and cross-platform IoT applications.' },

  { section: 'devdirections_description', rawName: 'rd', localeCode: 'ru', content: 'Проведение исследований и разработка инновационных решений.' },
  { section: 'devdirections_description', rawName: 'rd', localeCode: 'en', content: 'Conducting research and developing innovative solutions.' },

  // Фильтры команды (могут добавляться новые)
  { section: 'team_filters', rawName: 'all', localeCode: 'ru', content: 'Все' },
  { section: 'team_filters', rawName: 'all', localeCode: 'en', content: 'All' },
  { section: 'team_filters', rawName: 'management', localeCode: 'ru', content: 'Руководство' },
  { section: 'team_filters', rawName: 'management', localeCode: 'en', content: 'Management' },
  { section: 'team_filters', rawName: 'backend', localeCode: 'ru', content: 'Backend' },
  { section: 'team_filters', rawName: 'backend', localeCode: 'en', content: 'Backend' },
  { section: 'team_filters', rawName: 'frontend', localeCode: 'ru', content: 'Frontend' },
  { section: 'team_filters', rawName: 'frontend', localeCode: 'en', content: 'Frontend' },
  { section: 'team_filters', rawName: 'devops', localeCode: 'ru', content: 'DevOps' },
  { section: 'team_filters', rawName: 'devops', localeCode: 'en', content: 'DevOps' },
  { section: 'team_filters', rawName: 'uiUx', localeCode: 'ru', content: 'UI/UX' },
  { section: 'team_filters', rawName: 'uiUx', localeCode: 'en', content: 'UI/UX' },
  { section: 'team_filters', rawName: 'qa', localeCode: 'ru', content: 'QA' },
  { section: 'team_filters', rawName: 'qa', localeCode: 'en', content: 'QA' },

  // Категории кейсов (могут добавляться новые)
  { section: 'case_categories', rawName: 'all', localeCode: 'ru', content: 'Все' },
  { section: 'case_categories', rawName: 'all', localeCode: 'en', content: 'All' },
  { section: 'case_categories', rawName: 'mobile', localeCode: 'ru', content: 'Мобильные приложения' },
  { section: 'case_categories', rawName: 'mobile', localeCode: 'en', content: 'Mobile applications' },
  { section: 'case_categories', rawName: 'web_dev', localeCode: 'ru', content: 'WEB разработка' },
  { section: 'case_categories', rawName: 'web_dev', localeCode: 'en', content: 'WEB Development' },

//   Переводы адреса
  { section: 'ContactSection', rawName: 'addressRawName', localeCode: 'ru', content: 'г. Волгоград, пр. имени В.И. Ленина, 28-а'},
  { section: 'ContactSection', rawName: 'addressRawName', localeCode: 'en', content: '28a Lenina Avenue, Volgograd'},

  // Переводы кейсов
  // Сайт кафедры ПОАС
  { section: 'CasesSection_title', rawName: 'poas_site', localeCode: 'ru', content: 'Сайт кафедры ПОАС' },
  { section: 'CasesSection_title', rawName: 'poas_site', localeCode: 'en', content: 'POAS Department Website' },
  { section: 'CasesSection_description', rawName: 'poas_site', localeCode: 'ru', content: 'Веб-ресурс, объединяющий информацию для студентов, преподавателей и абитуриентов.' },
  { section: 'CasesSection_description', rawName: 'poas_site', localeCode: 'en', content: 'A web resource that brings together information for students, teachers and applicants.' },

  // Сайт студии GrapeLab
  { section: 'CasesSection_title', rawName: 'grapelab_site', localeCode: 'ru', content: 'Сайт студии GrapeLab' },
  { section: 'CasesSection_title', rawName: 'grapelab_site', localeCode: 'en', content: 'GrapeLab Studio Website' },
  { section: 'CasesSection_description', rawName: 'grapelab_site', localeCode: 'ru', content: 'Корпоративный веб-сайт для студии GrapeLab, демонстрирующий портфолио, услуги и команду.' },
  { section: 'CasesSection_description', rawName: 'grapelab_site', localeCode: 'en', content: 'Corporate website for GrapeLab studio, showcasing portfolio, services and team.' },

  // Нейро-бот AEvisual
  { section: 'CasesSection_title', rawName: 'aevisual_neurobot', localeCode: 'ru', content: 'Нейро-бот AEvisual' },
  { section: 'CasesSection_title', rawName: 'aevisual_neurobot', localeCode: 'en', content: 'Neuro-bot AEvisual' },
  { section: 'CasesSection_description', rawName: 'aevisual_neurobot', localeCode: 'ru', content: 'Нейро-сетевой бот для автоматизированного общения в Telegram от имени человека.' },
  { section: 'CasesSection_description', rawName: 'aevisual_neurobot', localeCode: 'en', content: 'A neural network bot for automated communication in Telegram on behalf of a person.' },

  // Нейро-бот для beauty-сферы
  { section: 'CasesSection_title', rawName: 'beauty_neurobot', localeCode: 'ru', content: 'Нейро-бот для beauty-сферы' },
  { section: 'CasesSection_title', rawName: 'beauty_neurobot', localeCode: 'en', content: 'Neuro-bot for the beauty industry' },
  { section: 'CasesSection_description', rawName: 'beauty_neurobot', localeCode: 'ru', content: 'Нейро-сетевой бот для автоматизации общения с клиентами и процессов администратора в бьюти-индустрии.' },
  { section: 'CasesSection_description', rawName: 'beauty_neurobot', localeCode: 'en', content: 'A neural network bot to automate communication with clients and administrator processes in the beauty industry.' },

  // WAY — умный сервис для туристов
  { section: 'CasesSection_title', rawName: 'way_tourism', localeCode: 'ru', content: 'WAY — умный сервис для туристов' },
  { section: 'CasesSection_title', rawName: 'way_tourism', localeCode: 'en', content: 'WAY — a smart service for tourists' },
  { section: 'CasesSection_description', rawName: 'way_tourism', localeCode: 'ru', content: 'Веб-сервис, который строит туристические маршруты по России с учётом бюджета, предпочтений и доступности.' },
  { section: 'CasesSection_description', rawName: 'way_tourism', localeCode: 'en', content: 'A web service that builds tourist routes in Russia, taking into account budget, preferences and accessibility.' },

  // Мини-приложение для Telegram
  { section: 'CasesSection_title', rawName: 'telegram_mini_app', localeCode: 'ru', content: 'Мини-приложение для Telegram' },
  { section: 'CasesSection_title', rawName: 'telegram_mini_app', localeCode: 'en', content: 'Mini-app for Telegram' },
  { section: 'CasesSection_description', rawName: 'telegram_mini_app', localeCode: 'ru', content: 'Сервис для быстрой онлайн-записи на услуги, позволяющий выбрать время и мастера прямо в мессенджере.' },
  { section: 'CasesSection_description', rawName: 'telegram_mini_app', localeCode: 'en', content: 'A service for quick online appointment for services, allowing you to select a time and a master right in the messenger.' },

  // Сайт Kompressor34
  { section: 'CasesSection_title', rawName: 'kompressor34_site', localeCode: 'ru', content: 'Сайт Kompressor34' },
  { section: 'CasesSection_title', rawName: 'kompressor34_site', localeCode: 'en', content: 'Kompressor34 Website' },
  { section: 'CasesSection_description', rawName: 'kompressor34_site', localeCode: 'ru', content: 'Корпоративный сайт для компании по продаже компрессоров с каталогом товаров и удобной формой заказа.' },
  { section: 'CasesSection_description', rawName: 'kompressor34_site', localeCode: 'en', content: 'Corporate website for a company selling compressors with a product catalog and a convenient order form.' },

  // Система мониторинга Жар-птица
  { section: 'CasesSection_title', rawName: 'zhar_ptica_monitoring', localeCode: 'ru', content: 'Система мониторинга Жар-птица' },
  { section: 'CasesSection_title', rawName: 'zhar_ptica_monitoring', localeCode: 'en', content: 'Zhar-Ptitsa Monitoring System' },
  { section: 'CasesSection_description', rawName: 'zhar_ptica_monitoring', localeCode: 'ru', content: 'Интеллектуальная система, использующая дроны для обнаружения лесных пожаров и прогнозирования их распространения.' },
  { section: 'CasesSection_description', rawName: 'zhar_ptica_monitoring', localeCode: 'en', content: 'An intelligent system that uses drones to detect forest fires and predict their spread.' },

  // Модуль трекинга статей
  { section: 'CasesSection_title', rawName: 'article_tracking_module', localeCode: 'ru', content: 'Модуль трекинга статей' },
  { section: 'CasesSection_title', rawName: 'article_tracking_module', localeCode: 'en', content: 'Article Tracking Module' },
  { section: 'CasesSection_description', rawName: 'article_tracking_module', localeCode: 'ru', content: 'Модуль для сайта, который отслеживает научные публикации и автоматически формирует отчеты и заключения.' },
  { section: 'CasesSection_description', rawName: 'article_tracking_module', localeCode: 'en', content: 'A module for a website that tracks scientific publications and automatically generates reports and conclusions.' },
];

const initialRefTables = [
  {
    name: 'stats',
    content: {
      staffCount: 15,
      technologies: [
        { key: 'JavaScript/TypeScript', value: 0.5 },
        { key: 'Python', value: 0.8 },
        { key: 'C++', value: 0.3 },
        { key: 'Golang', value: 0.2 },
      ],
      specialization: [
        { key: 'Backend', value: 0.7 },
        { key: 'Frontend', value: 0.6 },
        { key: 'DevOps', value: 0.4 },
        { key: 'UI/UX', value: 0.5 },
      ],
      clientCountries: 3,
      experienceFromYear: 1,
      successfulProjects: 5,
    },
  },
  {
    name: 'techstack',
    content: [
      { alt: 'C++', image_url: 'icons/c-plus-plus-logo.png' },
      { alt: 'Go', image_url: 'icons/go.png' },
      { alt: 'Python', image_url: 'icons/python.png' },
      { alt: 'HTML5', image_url: 'icons/html-5.png' },
      { alt: 'Java', image_url: 'icons/java-coffee-cup-logo.png' },
      { alt: 'C#', image_url: 'icons/c-sharp-logo.png' },
      { alt: 'Docker', image_url: 'icons/docker.png' },
      { alt: 'CSS', image_url: 'icons/external-cascading-style-sheets-language-used-for-describing-the-presentation-of-a-document-logo-light-tal-revivo.png' },
      { alt: 'Node.js', image_url: 'icons/external-nodejs-is-an-open-source-cross-platform-javascript-run-time-environment-logo-filled-tal-revivo.png' },
      { alt: 'React', image_url: 'icons/external-react-a-javascript-library-for-building-user-interfaces-logo-light-tal-revivo.png' },
      { alt: 'Figma', image_url: 'icons/figma.png' },
      { alt: 'Bootstrap', image_url: 'icons/bootstrap.png' },
      { alt: 'Flutter', image_url: 'icons/flutter.png' },
      { alt: 'PostgreSQL', image_url: 'icons/postgreesql.png' },
      { alt: 'Qt', image_url: 'icons/qt.png' },
      { alt: 'Visual Studio', image_url: 'icons/visual-studio.png' },
    ],
  },
  {
    name: 'cases',
    content: [
      { titleRawName: 'poas_site', category: 'WEB', image_url: 'icons/world.png', descriptionRawName: 'poas_site' },
      { titleRawName: 'grapelab_site', category: 'WEB', image_url: 'icons/world.png', descriptionRawName: 'grapelab_site' },
      { titleRawName: 'aevisual_neurobot', category: 'Bot', image_url: 'icons/bot.png', descriptionRawName: 'aevisual_neurobot' },
      { titleRawName: 'beauty_neurobot', category: 'Bot', image_url: 'icons/chat-bot.png', descriptionRawName: 'beauty_neurobot' },
      { titleRawName: 'way_tourism', category: 'WEB', image_url: 'icons/world.png', descriptionRawName: 'way_tourism' },
      { titleRawName: 'telegram_mini_app', category: 'Bot', image_url: 'icons/chat-bot.png', descriptionRawName: 'telegram_mini_app' },
      { titleRawName: 'kompressor34_site', category: 'WEB', image_url: 'icons/world.png', descriptionRawName: 'kompressor34_site' },
      { titleRawName: 'zhar_ptica_monitoring', category: 'System', image_url: 'icons/system.png', descriptionRawName: 'zhar_ptica_monitoring' },
      { titleRawName: 'article_tracking_module', category: 'System', image_url: 'icons/system.png', descriptionRawName: 'article_tracking_module' },
    ],
  },
  {
    name: 'contacts',
    content: {
      vk: 'grapelab',
      email: 'grapelabweb@gmail.com',
      phone: '+79370000000',
      dayoff: 'sunday',
      address: 'addressRawName',
      location: [48.71266630303582, 44.52660575712858],
      telegram: 'grapelab',
      whatsapp: '+79370000000',
      workdays: ['from_monday', 'from_saturday'],
      workhours: ['9:00', '18:00'],
      breakhours: ['12:30', '13:00'],
    },
  },
];

async function main() {
  console.log('Начинаем seeding динамических переводов...');

  // Очищаем существующие динамические переводы
  await prisma.localization.deleteMany({
    where: {
      section: {
        in: ['devdirections', 'team_filters', 'ContactSection', 'case_categories', "devdirections_description", 'CasesSection_title', 'CasesSection_description']
      }
    }
  });
  console.log('Очистили существующие динамические переводы');

  // await prisma.devDirection.deleteMany({
  //   where: {
  //     rawName: { in: devDirectionDefs.map(d => d.rawName) },
  //   }
  // });
  //
  // console.log("Очистили направления разработки")

  await prisma.refTable.deleteMany({
    where: {
      name: { in: initialRefTables.map(r => r.name) },
    }
  });
  console.log("Очистили refTables")

  // Создаем новые переводы
  for (const translation of dynamicTranslations) {
    await prisma.localization.create({
      data: translation,
    });
  }

  console.log(`Создано ${dynamicTranslations.length} динамических переводов`);

  //
  // console.log("Создание и заполнение devDirections")
  // await prisma.devDirection.createMany({
  //     data: devDirectionDefs,
  //     skipDuplicates: true,
  // });

  console.log("Создание и заполнение refTables")
  for (const ref of initialRefTables) {
    const exists = await prisma.refTable.findUnique({ where: { name: ref.name } });
    if (!exists) {
      await prisma.refTable.create({ data: { name: ref.name, content: ref.content } });
    }
  }

  console.log('Seeding завершен!');
}

main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error('Ошибка seeding:', e);
      await prisma.$disconnect();
      process.exit(1);
    });