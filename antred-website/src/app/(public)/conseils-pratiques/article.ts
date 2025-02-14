type Article = {
  id: string
  tag: string
  title: string
  summary: string
  author: string
  date: string
  cover: {
    src: string
    alt: string
  }
  content: {
    firstPart: string
    quote?: string
    secondPart: string
    thirdPart?: string
  }
  images: {
    src: string
    alt: string
  }[]
}

export const articles: Article[] = [
  {
    id: '1',
    tag: 'Conseils',
    title: 'Que faire en cas de disparition d’un proche à l’étranger ?',
    summary:
      'Dès les premiers instants de la disparition, le compte à rebours est lancé. La vie de la personne disparue est en jeu. Le démarrage d’une enquête au plus tôt est crucial.',
    author: 'Sybille Veron',
    date: 'hier',
    cover: {
      src: '/images/presse/emergency.jpg',
      alt: 'Image d&apos;urgence en cas de disparition'
    },
    content: {
      firstPart: `
        <p>Dès les premiers instants de la disparition, le compte à rebours est lancé. La vie de la personne disparue est en jeu. Le démarrage d’une enquête au plus tôt est crucial.</p>
        <p>Quels sont les premiers gestes d’urgence à accomplir ? Voici nos conseils :</p>
      `,
      quote: `
        <blockquote>Dans le cas contraire, laissez-vous porter par l’espoir de sauver la personne que vous aimez et osez déranger.</blockquote>
      `,
      secondPart: `
        <ul>
          <li><strong>Contactez les hébergements connus</strong>
            <p>Si votre proche vous a laissé les coordonnées des établissements, hôtels, gîtes, ou des personnes chez qui il est censé loger, commencez par les appeler directement pour obtenir des renseignements. Que ce soit le dernier hôtel connu ou sa prochaine destination.</p>
          </li>
          <li><strong>Contactez les autorités françaises locales</strong>
            <p>En l’absence de nouvelles ou de réponse, appelez immédiatement les autorités françaises sur place (ambassade, consulat) pour leur signaler la disparition de votre proche et expliquez-leur la situation et vos motifs d’inquiétude. Demandez-leur de contacter les services de police locaux.</p>
            <p>Une permanence est mise en place les soirs et week-ends dans les ambassades françaises. N’ayez jamais peur de déranger ! Même si l’accueil est décevant, vous avez le droit de solliciter les autorités françaises. Ce sont vos premiers relais sur place face aux autorités locales.</p>
            <p>Dans le meilleur des cas, c’était une fausse alerte ou la situation s’avère moins grave qu’escomptée : tant mieux !</p>
          </li>
          <li><strong>Prenez un avocat et portez plainte</strong>
            <p>Prenez un avocat idéalement spécialisé en droit pénal et allez déposer une plainte pour disparition inquiétante au commissariat ou à la brigade de gendarmerie de la ville d’origine de la personne disparue.</p>
          </li>
          <li><strong>Diffusez un avis de recherche</strong>
            <p>Créez et diffusez un avis de recherche en plusieurs langues (voir rubrique). Ces avis de recherche peuvent vous apporter un témoignage déterminant, surtout si les services de police tardent à lancer des recherches, font fausse route ou refusent d’enquêter.</p>
          </li>
          <li><strong>Rendez-vous sur place</strong>
            <p>Si vous en avez la possibilité, prenez un avion et rendez-vous sur place dès que possible. Vous comprendrez mieux la géographie des lieux, envisagerez mieux les scénarios possibles/impossibles et pourrez en référer aux autorités françaises. Si les enquêteurs locaux sont peu coopératifs, votre présence sera un gage de pression.</p>
            <p>Derrière chaque disparition se joue des relations diplomatiques entre la France et le pays hôte.</p>
          </li>
        </ul>
        <p><strong>Message aux proches des familles : mobilisez-vous !</strong></p>
      `,
      thirdPart: `
        <ul>
          <li><strong>Organisez un QG</strong>
            <p>La famille, surtout si elle se rend sur place, a besoin d’un QG pour diffuser les avis de recherche mais aussi pour lever des fonds. Les moyens financiers font partie des freins principaux à la recherche d’un disparu à l’étranger. Transport, hébergement, recrutement d’interprètes ou de guides sur place, honoraires d’avocats… À court, moyen et long termes, l’argent est le nerf de la quête.</p>
          </li>
          <li><strong>Diffusez largement les avis de recherche</strong>
            <p>Partagez ces avis par tous les moyens : réseaux sociaux (pages spécialisées dans les voyages, par exemple), posts répétés, messages personnels... Faites fonctionner le bouche-à-oreille !</p>
            <p><strong>Utilisez les réseaux sociaux :</strong> Publiez les avis de recherche sur Facebook, Twitter, Instagram, LinkedIn, et toute autre plateforme où vous avez une présence. Rejoignez des groupes spécialisés dans les voyages et les expatriés.</p>
            <p><strong>Communiquez avec votre réseau :</strong> Envoyez des messages personnels à vos amis et connaissances. Connaissez-vous quelqu’un au Japon ? Pouvez-vous diffuser à vos amis argentins ? Êtes-vous toujours en Nouvelle-Zélande en ce moment ?</p>
            <p><strong>Utilisez les forums et les applications de messagerie :</strong> Postez dans des forums de discussion pertinents et utilisez des applications de messagerie instantanée comme WhatsApp, WeChat, et Telegram pour toucher un large public rapidement.</p>
            <p><strong>Faites appel aux influenceurs :</strong> Contactez des influenceurs sur les réseaux sociaux qui ont un large public. Leur portée peut amplifier la diffusion des avis de recherche de manière significative. Demandez-leur de partager l'information avec leur audience.</p>
            <p>Chaque partage compte et peut faire la différence. Mobilisez votre réseau et encouragez vos contacts à faire de même !</p>
            <p>Un témoignage-clé peut parvenir ainsi à la famille et faire basculer l’affaire.</p>
          </li>
        </ul>
      `
    },
    images: [
      {
        src: '/images/presse/emergency.jpg',
        alt: 'Image d&apos;urgence en cas de disparition'
      }
    ]
  },
  {
    id: '2',
    tag: 'Démarches Légales',
    title: 'Que faire en cas de disparition inquiétante : droits et démarches',
    summary:
      'En cas de disparition inquiétante d&apos;une personne majeure, découvrez vos droits et les démarches possibles, en France ou à l&apos;étranger.',
    author: 'Sybille Veron',
    date: 'hier',
    cover: {
      src: '/images/presse/emergency.jpg',
      alt: 'Image d&apos;urgence en cas de disparition'
    },
    content: {
      firstPart: `
        <h2>Dépot de plainte pour disparition inquiétante</h2>
        <p>En France ou à l’étranger, la question est toujours la même : ai-je le droit de porter plainte en cas de disparition d’une personne majeure ?</p>
        <p>Car là est le paradoxe : toute personne majeure a le droit de disparaître.</p>
        <ul>
          <li>Face à un policier, la famille doit caractériser les motifs d’inquiétudes.</li>
          <li>La prise en compte de la plainte dépend souvent du flair et de la motivation de l’agent.</li>
        </ul>
        <p>La réponse est donc : oui, vous avez le droit de porter plainte. <strong>Prendre un avocat</strong> peut vous conseiller et vous aiguiller dans vos démarches.</p>
        <p>En cas de refus, il est possible d'écrire au procureur général.</p>
      `,
      quote: `
        "Prendre un avocat peut vous conseiller et vous aiguiller dans vos démarches."
      `,
      secondPart: `
        <h2>La disparition se prolonge</h2>
        <h3>Présomption d'absence : Article 112</h3>
        <p>“Lorsqu’une personne a cessé de paraître au lieu de son domicile ou de sa résidence sans que l’on ait eu de nouvelles, le juge des tutelles peut, à la demande des parties intéressées ou du ministère public, constater qu’il y a présomption d’absence.”</p>
        
        <h3>Déclaration d'absence : Article 122 du code civil</h3>
        <p>“Lorsqu’il sera écoulé dix ans depuis le jugement qui a constaté la présomption d’absence (...) l’absence pourra être déclarée par le tribunal judiciaire à la requête de toute partie intéressée ou du ministère public. Il en sera de même quand, à défaut d’une telle constatation, la personne aura cessé de paraître au lieu de son domicile ou de sa résidence, sans que l’on ait eu de nouvelles pendant plus de vingt ans.”</p>
      `,
      thirdPart: `
        <h3>Déclaration judiciaire de décès en cas de disparition - Article 88 du code civil</h3>
        <p>“Peut-être judiciairement déclaré, à la requête du procureur de la République ou des parties intéressées, le décès de tout Français disparu en France ou hors de France, dans des circonstances de nature à mettre sa vie en danger, lorsque son corps n’a pu être retrouvé.”</p>
        <p>Article 88, alinéa 3 : “La procédure de déclaration judiciaire de décès est également applicable lorsque le décès est certain mais que le corps n’a pas pu être retrouvé.”</p>
        <p>Ce cas s'applique lorsque les conditions de disparition font présumer que l’individu est décédé sans que le corps n’ait été retrouvé. Par exemple : accident d’avion en pleine mer, naufrage, séisme, explosion atomique. Dans ce cas, il est possible de déclarer immédiatement la disparition de la personne sans attendre les dix ans prévus par la procédure d’absence.</p>
      `
    },
    images: [
      {
        src: '/images/presse/emergency.jpg',
        alt: 'Image d&apos;urgence en cas de disparition'
      }
    ]
  }
]

export const parolesExpert: Article[] = [
  {
    id: '3',
    tag: 'Expertise Légale',
    title: `L'importance du conseiller forensique dans les affaires de disparition`,
    summary: `Dans les affaires de disparition, l'expertise d'un conseiller forensique peut faire la différence entre une enquête réussie et une impasse. Découvrez pourquoi son rôle est essentiel.`,
    author: 'Sébastien Aguilar',
    date: `aujourd'hui`,
    cover: {
      src: '/images/presse/forenseekcover.jpg',
      alt: `Image symbolisant l'enquête en cas de disparition`
    },
    content: {
      firstPart: `
        <h2>Pourquoi faire appel à un conseiller forensique ?</h2>
        <p>Dans les affaires de disparition, chaque minute est cruciale. Lorsque les proches réalisent qu’un membre de leur famille a disparu, ils se retrouvent souvent dans une situation d'urgence où les émotions prennent le dessus. Cependant, malgré le choc et l'angoisse, il est essentiel de garder un esprit analytique et de prendre les bonnes décisions dès le début de l'enquête.</p>
        <p>C'est ici qu'intervient le conseiller forensique. Son rôle est de fournir une expertise technique pour identifier et préserver les éléments de preuve cruciaux, et ainsi guider les premières étapes de l'enquête. Sa connaissance approfondie des procédures légales et des techniques d'investigation scientifique lui permet d'aider les familles à optimiser leurs efforts et de s'assurer que les preuves importantes ne sont pas négligées. Ce professionnel devient souvent la première ligne de défense pour ceux qui veulent maximiser leurs chances de retrouver leur proche en sécurité.</p>
        <p>En résumé, un conseiller forensique est un expert capable de détecter des indices que d'autres pourraient ignorer. Il fournit un soutien technique et émotionnel aux familles, et les aide à naviguer dans les méandres des enquêtes judiciaires. Sa présence permet de transformer une enquête chaotique en une investigation structurée et méthodique.</p>
      `,
      quote: `
        "Dans une enquête pour disparition, chaque détail compte, et le conseiller forensique est là pour s'assurer qu'aucun n'échappe aux autorités."
      `,
      secondPart: `
        <h2>Les compétences du conseiller forensique</h2>
        <p>Le conseiller forensique possède un éventail de compétences uniques qui en font un allié indispensable dans les affaires de disparition. En combinant des connaissances scientifiques, juridiques et psychologiques, il est capable de traiter chaque aspect d'une enquête avec rigueur et professionnalisme. Voici quelques-unes des compétences clés d'un conseiller forensique :</p>
        <ul>
          <li><strong>Analyse de preuves matérielles</strong>
            <p>Le conseiller forensique est formé pour examiner et interpréter des preuves matérielles, telles que des objets personnels, des traces laissées sur place, ou des documents retrouvés. Ces éléments peuvent sembler insignifiants pour un œil non averti, mais pour un expert, chaque détail peut potentiellement révéler des informations essentielles sur la personne disparue. Par exemple, un billet de transport, un reçu de restaurant, ou même un fragment de papier peuvent fournir des indices sur les derniers mouvements ou intentions de la personne.</p>
            <p>En outre, l'expertise en analyse de preuves matérielles permet au conseiller forensique de détecter des incohérences dans les récits des témoins ou des suspects, et d'évaluer la probabilité de scénarios spécifiques. Ces compétences d'analyse sont souvent déterminantes dans les affaires de disparition, où chaque détail compte.</p>
          </li>
          <li><strong>Expertise en criminologie et psychologie</strong>
            <p>Les conseillers forensiques possèdent souvent une formation en criminologie et en psychologie, ce qui leur permet de comprendre les comportements humains complexes qui entourent une disparition. Cette compétence leur permet d'évaluer le profil psychologique de la personne disparue, ainsi que ceux des individus impliqués dans l'affaire, qu'ils soient témoins ou suspects potentiels. La compréhension de la psychologie humaine permet de formuler des hypothèses réalistes sur ce qui aurait pu se passer.</p>
            <p>Par exemple, un conseiller forensique peut analyser le comportement passé de la personne disparue pour déterminer si elle pourrait avoir mis sa propre vie en danger, ou si elle pourrait avoir été victime de violence. Cette compréhension du contexte psychologique est cruciale pour guider l'enquête de manière stratégique, en orientant les recherches vers les pistes les plus probables.</p>
          </li>
          <li><strong>Collaboration avec les autorités</strong>
            <p>Dans les affaires de disparition, il est fréquent que plusieurs services soient impliqués dans l'enquête : police locale, avocats, services sociaux, etc. Le conseiller forensique joue un rôle de facilitateur en coordonnant les efforts des différents intervenants, assurant ainsi une meilleure communication et une efficacité accrue dans l'enquête.</p>
            <p>Grâce à sa formation, le conseiller forensique est capable de traduire des informations techniques en termes compréhensibles pour les familles et les autorités. Il veille également à ce que les éléments de preuve soient traités correctement pour respecter les procédures judiciaires, en minimisant les risques que des erreurs de traitement ne compromettent l’enquête.</p>
          </li>
        </ul>
      `,
      thirdPart: `
        <h2>Quand faire appel à un conseiller forensique ?</h2>
        <p>Faire appel à un conseiller forensique dès les premières heures de la disparition est l'idéal, car cela permet de lancer une enquête méthodique dès le début. Cependant, même si une enquête est déjà en cours, l’ajout d’un conseiller forensique peut apporter un nouveau souffle et explorer des pistes qui auraient pu être négligées.</p>
        <p>Parfois, les autorités locales peuvent manquer de ressources ou d'expertise pour gérer efficacement des affaires complexes de disparition. C’est dans ces situations que le conseiller forensique devient indispensable. En se basant sur les éléments déjà recueillis, il peut proposer des angles d'investigation nouveaux et identifier des failles potentielles dans les approches existantes.</p>
        <p>Dans les cas les plus difficiles, lorsque les familles sont épuisées et que l’enquête semble piétiner, l’intervention d’un conseiller forensique redonne de l’espoir. Sa méthodologie et son objectivité permettent de transformer une affaire autrefois perçue comme une impasse en une enquête avec des perspectives nouvelles. Il offre également aux familles un soutien émotionnel précieux, en leur permettant de s’appuyer sur une expertise rassurante et professionnelle.</p>
      `
    },
    images: [
      {
        src: '/images/presse/forenseek2.jpeg',
        alt: `Image symbolisant l'enquête en cas de disparition`
      }
    ]
  }
]
