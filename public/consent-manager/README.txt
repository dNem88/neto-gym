Consent Manager Installation Instructions

1. Extract the contents of this zip file
2. Place the files in your website directory
3. Add the following code to your HTML page, inside the <head> tag:

<link rel="stylesheet" id="silktide-consent-manager-css" href="path-to-css/silktide-consent-manager.css">
<script src="path-to-js/silktide-consent-manager.js"></script>
<script>
silktideCookieBannerManager.updateCookieBannerConfig({
  background: {
    showBackground: true
  },
  cookieIcon: {
    position: "bottomLeft"
  },
  cookieTypes: [
    {
      id: "",
      name: "Необходими",
      description: "<p>Тези бисквитки са необходими за правилното функциониране на уебсайта и не могат да бъдат изключени. Те помагат за неща като влизане в системата и задаване на вашите предпочитания за поверителност.</p>",
      required: true,
      onAccept: function() {
        console.log('Add logic for the required Необходими here');
      }
    },
    {
      id: "",
      name: "Аналитични",
      description: "<p>Тези бисквитки ни помагат да подобрим уебсайта, като проследяват кои страници са най-популярни и как посетителите се придвижват из сайта.</p>",
      required: false,
      onAccept: function() {
        gtag('consent', 'update', {
          analytics_storage: 'granted',
        });
        dataLayer.push({
          'event': 'consent_accepted_',
        });
      },
      onReject: function() {
        gtag('consent', 'update', {
          analytics_storage: 'denied',
        });
      }
    },
    {
      id: "",
      name: "Маркетинг",
      description: "<p>Тези бисквитки осигуряват допълнителни функции и персонализация, за да подобрят вашето изживяване. Те могат да бъдат зададени от нас или от наши партньори, чиито услуги използваме.</p>",
      required: false,
      onAccept: function() {
        gtag('consent', 'update', {
          ad_storage: 'granted',
          ad_user_data: 'granted',
          ad_personalization: 'granted',
        });
        dataLayer.push({
          'event': 'consent_accepted_',
        });
      },
      onReject: function() {
        gtag('consent', 'update', {
          ad_storage: 'denied',
          ad_user_data: 'denied',
          ad_personalization: 'denied',
        });
      }
    }
  ],
  text: {
    banner: {
      description: "<p>Използваме бисквитки на нашия сайт, за да подобрим потребителското ви изживяване, да предоставяме персонализирано съдържание и да анализираме трафика си.&nbsp;<a href=\"https://medical-portfolio-site.dsdgroupre.workers.dev/cookie-policy\" target=\"_blank\">Политика на бисквитките</a></p>",
      acceptAllButtonText: "Приеми всички",
      acceptAllButtonAccessibleLabel: "Приеми всички бисквитки",
      rejectNonEssentialButtonText: "Откажи незадължителните",
      rejectNonEssentialButtonAccessibleLabel: "Откажи незадължителните",
      preferencesButtonText: "Покажи детайли",
      preferencesButtonAccessibleLabel: "Покажи детайли"
    },
    preferences: {
      title: "Персонализирайте своите предпочитания за бисквитки",
      description: "<p>Ние уважаваме вашето право на поверителност. Можете да изберете да не позволявате някои видове бисквитки. Вашите предпочитания за бисквитки ще се прилагат за целия ни уебсайт.</p>",
      creditLinkText: "Вземете този банер",
      creditLinkAccessibleLabel: "Вземете този банер"
    }
  }
});
</script>
