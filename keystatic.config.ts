import { config, fields, collection } from '@keystatic/core';
const isProd = import.meta.env.PROD;


export default config({
  storage: isProd 
    ? { kind: 'cloud' } 
    : { kind: 'local' },

  cloud: {
    // Взема ID-то от Cloudflare Variables, иначе ползва дефолт за тестване
    project: import.meta.env.KEYSTATIC_CLOUD_PROJECT || 'astro-template/startertemplate',
  },
 singletons: {
  settings: {
    label: 'Настройки на бизнеса',
    path: 'src/content/settings',
    schema: {
      businessName: fields.text({ label: 'Име на фирмата' }),
      businessEIK: fields.text({ label: 'ЕИК / БУЛСТАТ' }),
      businessMOL: fields.text({ label: 'МОЛ (Управител)' }),
      phone: fields.text({ label: 'Телефон за връзка' }),
      email: fields.text({ label: 'Имейл адрес' }),
      address: fields.text({ label: 'Адрес', multiline: true }),
      workingHours: fields.text({ label: 'Работно време' }),
      socialFacebook: fields.url({ label: 'Facebook страница' }),
    },
  },
},
  collections: {
    // КОЛЕКЦИЯ АВТОРИ
    authors: collection({
      label: 'Автори',
      slugField: 'name',
      path: 'src/content/authors/*', // Създава файл за всеки автор
      format: { data: 'json' }, // ВАЖНО: Записва данните в .json файл
      schema: {
        name: fields.slug({
          name: {
            label: 'Име на автора',
            description: 'Въведете пълното име на автора'
          }
        }),
        image: fields.image({
          label: 'Снимка',
          description: 'Профилна снимка на автора',
          directory: 'public/images/authors', // Change to public folder
          publicPath: '/images/authors/', // This will work in URLs
        }),
        bio: fields.markdoc({
          label: 'Биография',
          description: 'Кратка информация за автора'
        }),
      },
    }),

    // КОЛЕКЦИЯ КАТЕГОРИИ/ТАГОВЕ
    tags: collection({
      label: 'Категории',
      slugField: 'title',
      path: 'src/content/tags/*',
      format: { data: 'json' }, // ВАЖНО: Записва данните в .json файл
      schema: {
        title: fields.slug({
          name: {
            label: 'Заглавие на категорията',
            description: 'Името на категорията (напр. "Новини" или "Съвети")'
          }
        }),
        description: fields.text({
          label: 'Описание',
          multiline: true,
          description: 'Кратко описание на категорията (помага за SEO)'
        }),
      },
    }),

    // КОЛЕКЦИЯ БЛОГ ПУБЛИКАЦИИ
    blog: collection({
      label: 'Блог публикации',
      slugField: 'title',
      path: 'src/content/blog/*/', // Тук папките са правилни, защото имаме изображения и съдържание
      format: { contentField: 'content' }, // Основното съдържание отива в index.mdoc
      schema: {
        title: fields.slug({
          name: {
            label: 'Заглавие на статията',
            description: 'Основното заглавие на публикацията'
          },
          slug: {
            label: 'URL адрес (Slug)',
            description: 'Това ще бъде част от адреса на страницата'
          }
        }),

        description: fields.text({
        label: 'SEO описание',
        description: 'Мета описание за търсачките, обикновено 140–160 символа.',
        multiline: true,
}),

        excerpt: fields.text({
        label: 'Кратко описание',
        description: 'Кратко резюме на статията за блог картите и страниците с категории.',
         multiline: true,
}),

        author: fields.relationship({
          label: 'Автор',
          description: 'Изберете кой е написал тази статия',
          collection: 'authors',
        }),

        tags: fields.array(
          fields.relationship({
            label: 'Категория',
            collection: 'tags',
          }),
          {
            label: 'Категории на статията',
            description: 'Можете да изберете една или повече категории',
            itemLabel: (props) => props.value || 'Изберете категория',
          }
        ),

        publishedDate: fields.date({
          label: 'Дата на публикуване',
          description: 'Изберете датата на публикуване'
        }),
        mainImageUrl: fields.image({
          label: 'Основно изображение',
          description: 'Основна снимка (featured image) за статията',
          directory: 'public/images/blog', 
          // This is the path the browser will use
          publicPath: '/images/blog/',
        }),
        content: fields.markdoc({
          label: 'Съдържание',
          description: 'Напишете вашата статия тук.',
          options: {
            image: {
              directory: 'public/blog', // Changed from src/content/blog
              publicPath: '/blog/', // This makes it accessible at /blog/slug/image.png
            }
          }
        }),
      },
    }),
  },
});