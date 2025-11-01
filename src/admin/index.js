
import AdminJSExpress from '@adminjs/express';
import { Database, Resource, getModelByName } from '@adminjs/prisma';
import { PrismaClient } from '@prisma/client';
import AdminJS, { ValidationError } from 'adminjs';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import componentLoader, { RefTableContentEditor, JsonEditor } from './component-loader.js';
import { makeUploadFeature } from './upload.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Создаём экземпляр PrismaClient (подхватит схему из папки prisma/)
const prisma = new PrismaClient();

const adminEmail = process.env.ADMIN_EMAIL;
const adminPassword = process.env.ADMIN_PASSWORD;

//remove password from env safety
process.env.ADMIN_EMAIL = undefined;
process.env.ADMIN_PASSWORD = undefined;

const authenticate = async (email, password) => {
  if (email === adminEmail && password === adminPassword) {
    return { email: adminEmail, role: 'admin', id: 0 };
  }

  // Ищем пользователя в БД
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isStaff || !user.pwdhash) return null;
  const isMatch = await bcrypt.compare(password, user.pwdhash);

  if (isMatch) {
    return { email: user.email, role: 'staff', id: user.id };
  }

  return null;
};

// Регистрируем адаптер Prisma для AdminJS
AdminJS.registerAdapter({
  Resource: Resource,
  Database: Database,
});

const adminOptions = {
  componentLoader,
  resources: [
    {
      resource: { model: getModelByName('Review'), client: prisma },
      features: [makeUploadFeature('imagePath', 'reviews')],
      options: {
        properties: {
          metadata: { type: 'mixed' },
        },
      },
    },
    {
      resource: { model: getModelByName('Project'), client: prisma },
      features: [makeUploadFeature('imagePath', 'projects')],
      options: {
        properties: {
          name: {
            isTitle: true,
          },
          heroContent: {
            type: 'textarea', // изменить с 'richtext' на 'textarea'
            isVisible: { list: false, edit: true, show: true },
          },
          calloutContent: {
            type: 'textarea', // изменить с 'richtext' на 'textarea'
            isVisible: { list: false, edit: true, show: true },
          },
          aspectsList: {
            type: 'mixed',
            isVisible: { list: false, edit: true, show: true },
            components: {
              edit: JsonEditor,
              show: JsonEditor,
            },
          },
          galleryImages: {
            type: 'mixed',
            isVisible: { list: false, edit: true, show: true },
            components: {
              edit: JsonEditor,
              show: JsonEditor,
            },
          },
          projectTechStack: {
            type: 'mixed',
            isVisible: { list: false, edit: true, show: true },
            components: {
              edit: JsonEditor,
              show: JsonEditor,
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('Partner'), client: prisma },
      features: [makeUploadFeature('imagePath', 'partners')],
      options: {
        properties: {
          metadata: {
            type: 'mixed',
            isVisible: { list: false, edit: true, show: true },
            components: {
              edit: JsonEditor,
              show: JsonEditor,
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('DevDirection'), client: prisma },
      features: [makeUploadFeature('imagePath', 'icons')],
      options: {
        properties: {
          metadata: {
            type: 'mixed',
            isVisible: { list: false, edit: true, show: true },
            components: {
              edit: JsonEditor,
              show: JsonEditor,
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('Employee'), client: prisma },
      features: [makeUploadFeature('imagePath', 'employees')],
      options: {
        properties: {
          metadata: {
            type: 'mixed',
            isVisible: { list: false, edit: true, show: true },
            components: {
              edit: JsonEditor,
              show: JsonEditor,
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('ProjectEmployee'), client: prisma },
      options: {},
    },
    {
      resource: { model: getModelByName('Localization'), client: prisma },
      options: {},
    },
    {
      resource: {
        model: getModelByName('DynamicTranslationBuffer'),
        client: prisma,
      },
      options: {
        properties: {
          originalMessageHash: {
            type: 'string',
            isVisible: { list: true, edit: false, show: true },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('RefTable'), client: prisma },
      options: {
        properties: {
          content: {
            isRequired: true,
            type: 'mixed',
            components: {
              edit: RefTableContentEditor,
              show: RefTableContentEditor,
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('User'), client: prisma },
      options: {
        properties: {
          pwdhash: {
            type: 'password',
            label: 'New password',
            isVisible: {
              list: false,
              filter: false,
              show: false,
              edit: true,
            },
          },
        },
        actions: {
          edit: {
            before: async (request, context) => {
              const { record, currentAdmin } = context;

              if (currentAdmin?.id !== 0 && record?.params?.pwdhash) {
                throw new ValidationError({
                  pwdhash: {
                    message:
                      'You are not permitted to change password for this user',
                  },
                });
              }

              // Храним оригинальный pwdhash в контексте для последующего восстановления
              context.originalPwdHash = record?.params?.pwdhash;

              // Удаляем значение из формы редактирования
              if (record?.params?.pwdhash) {
                record.params.pwdhash = '';
              }

              // Обработка заполненного пароля
              if (request.payload?.pwdhash && currentAdmin?.id === 0) {
                const password = request.payload.pwdhash;
                const hashed = await bcrypt.hash(password, 10);
                request.payload.pwdhash = hashed;
              } else {
                // Если поле пустое — убираем из payload, чтобы не затирать
                delete request.payload?.pwdhash;
              }

              return request;
            },
          },
          new: {
            before: async (request, context) => {
              const { currentAdmin } = context;

              if (currentAdmin?.id !== 0) {
                throw new ValidationError({
                  pwdhash: {
                    message: 'You are not permitted to create users',
                  },
                });
              }

              if (request.payload?.pwdhash && currentAdmin?.id === 0) {
                const password = request.payload.pwdhash;
                const hashed = await bcrypt.hash(password, 10);
                request.payload.pwdhash = hashed;
              }

              return request;
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('Service'), client: prisma },
      options: {
        properties: {
          metadata: {
            type: 'mixed',
            isVisible: { list: false, edit: true, show: true },
            components: {
              edit: JsonEditor,
              show: JsonEditor,
            },
          },
        },
      },
    },
    {
      resource: { model: getModelByName('ServiceFeature'), client: prisma },
      options: {
        properties: {
          metadata: {
            type: 'mixed',
            isVisible: { list: false, edit: true, show: true },
            components: {
              edit: JsonEditor,
              show: JsonEditor,
            },
          },
        },
      },
    },
  ],
  rootPath: '/',
  branding: {
    companyName: 'GrapeLab Admin',
    logo: '/static/grapelogo-admin.svg',
    softwareBrothers: false,
  },
  assets: {
    styles: [
      'https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css',
    ],
  },
};

// Конфигурация AdminJS
const adminJs = new AdminJS(adminOptions);

// Создаём роутер Express для AdminJS
const adminRouter = AdminJSExpress.buildAuthenticatedRouter(
  adminJs,
  {
    authenticate,
    cookieName: 'grapelab_adminjs',
    cookiePassword:
      process.env.COOKIE_SECRET || 'some-secret-password-used-to-secure-cookie',
  },
  null,
  {
    resave: false,
    saveUninitialized: false,
    secret:
      process.env.COOKIE_SECRET || 'some-secret-password-used-to-secure-cookie',
    name: 'grapelab_adminjs',
  }
);

adminJs.watch();

const port = 8080;
const app = express();

app.use('/static', express.static(path.join(__dirname, '../../public')));
app.use('/resources/public', express.static(path.join(__dirname, '../../public')));
app.use(
  '/resources/public/api/uploads',
  express.static(path.join(__dirname, '../../public/uploads'))
);
app.use(adminJs.options.rootPath, adminRouter);


app.listen(port, () => {
  console.log(`AdminJS is running at http://localhost:${port}`)
})
