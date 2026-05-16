-- Combined WashWorld database
-- Base database merged with queue status, wash categories, location descriptions,
-- selected primary wash location, subscription package data and payment card metadata.

DROP DATABASE IF EXISTS `2026_1_washworld`;
CREATE DATABASE `2026_1_washworld` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `2026_1_washworld`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

START TRANSACTION;

CREATE TABLE `wash_locations` (
  `location_pk` varchar(32) NOT NULL,
  `location_name` varchar(100) NOT NULL,
  `location_city` varchar(100) NOT NULL,
  `location_address` varchar(255) NOT NULL,
  `location_opening_hours` varchar(100) NOT NULL,
  `location_lat` decimal(10,7) DEFAULT NULL,
  `location_lng` decimal(10,7) DEFAULT NULL,
  `que_status` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `in_que` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `location_description` text NOT NULL,
  PRIMARY KEY (`location_pk`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `wash_locations`
(`location_pk`, `location_name`, `location_city`, `location_address`, `location_opening_hours`, `location_lat`, `location_lng`, `que_status`, `in_que`, `location_description`)
VALUES
('loc001', 'Wash World Køge', 'Køge', 'Københavnsvej 86, 4600 Køge', '07:00 - 22:00', 55.456146, 12.182126, 2, 1, 'Trænger din bil til en vask, så læg vejen forbi Wash World på Københavnsvej 86 i Køge. Vi har åbent hver dag fra 7-22. Her kan du købe en miljørigtig og skånsom bilvask i god kvalitet i vores to vaskehaller. Vi anvender den nyeste teknologi, der sikrer dig en effektiv og økonomisk bilvask. Vi tilbyder 3 forskellige bilvaske: Guld, Premium og All Inclusive. Du kan til enhver tid købe en enkeltvask, men du kan også vælge at købe et månedligt abonnement. Som abonnent kan du vaske så mange gange, du vil, hver eneste måned for et fast beløb.'),
('loc002', 'Wash World Ishøj', 'Ishøj', 'Vejleåvej 19, 2635 Ishøj', '07:00 - 22:00', 55.615676, 12.351193, 4, 2, 'I Ishøj kan du vaske din bil i Wash World på Vejleåvej 19. Vores vaskehal, som har åbent 7-22 alle dage, ligger lige ved siden af Burger King lidt udenfor Ishøj. I Ishøj har vi 2 vaskehal og 2 Vask Selv stationer, som er klar til at vaske din bil. Har du lyst til at prøve bilvask på en nem og billig måde – hvor du ikke skal have kortet op af lommen hver gang? Så er et medlemskab hos Wash World lige noget for dig. Et medlemskab sikrer dig ubegrænset bilvask for et fast månedligt beløb.'),
('loc003', 'Wash World Roskilde', 'Roskilde', 'Ringstedvej 73, 4000 Roskilde', '07:00 - 22:00', 55.641716, 12.080347, 1, 0, 'På Ringstedvej 73 i Roskilde kan du få ubegrænset bilvask fra kun 139 kr. pr. måned med et Wash World medlemskab. Vi benytter os af nummerpladescanning, så du skal ikke engang have penge eller medlemskort op af lommen, når din bil skal vaskes. Din nummerplade registreres af kameraet ved vaskehallen, som derved åbner porten for dig. Du får den absolut mest enkle løsning på bilvask med et medlemskab, men du kan også sagtens købe en enkeltvask som ikke-medlem. Vores bilvask er miljørigtig og skånsom, og vi har vaskehaller over hele Danmark.

'),
('loc004', 'Wash World Taastrup', 'Taastrup', 'Roskildevej 376, 2630 Taastrup', '07:00 - 22:00', 55.652414, 12.301533, 3, 1, 'På Roskildevej 376 i Taastrup finder du Wash World med hele 3 vaskehaller, der er klar til at vaske din bil fin og ren i åbningstiden fra 7-22. Wash World giver dig mulighed for bilvask, som er nem og overkommelig i en travl hverdag. Du behøver ikke at tage dit kort frem af tegnebogen hver gang, du vasker. Et medlemskab giver dig ubegrænset vask til en fast lav pris!

Vælg mellem Guld til 139 kr. om måneden, Premium til 169 kr. om måneden og All Inclusive til 199 kr. om måneden. Uanset hvilken du vælger, får du kvalitet for pengene i vores effektive vaskehaller. Det kan betale sig at have et medlemskab allerede efter vask nr. to hver måned.'),
('loc005', 'Wash World Ballerup', 'Ballerup', 'Industriparken 6, 2750 Ballerup', '07:00 - 22:00', 55.731226, 12.363456, 0, 0, 'I Industriparken 6 i Ballerup finder du Wash World med hele 2 vaskehaller og 2 Vask Selv stationer. Vi tilbyder bilvask, der er tilgængeligt via medlemskab eller enkeltstående køb med betalingskort. Fordelene hos os er en effektiv, tidsbesparende og miljørigtig bilvask med kort ventetid. Find Wash World i industrikvarteret i Ballerup lige ved Ringvejen.'),
('loc006', 'Wash World Herlev', 'Herlev', 'Nørrelundvej 2, 2730 Herlev', '07:00 - 22:00', 55.723442, 12.423231, 2, 1, 'Du finder Wash World på Nørrelundvej 2B i Herlev – lige ved Herlev Hovedgade. På denne adresse tilbyder vi 2 vaskehaller og 2 Vask Selv stationer. Det er let at lægge vejen forbi, når bilen trænger til en vask. Vores bilvask er kendetegnet ved en miljørigtig og skånsom bilvask, og vi anvender den nyeste teknologi for at give dig den bedste service.'),
('loc007', 'Wash World Hillerød', 'Hillerød', 'Industrivænget 3, 3400 Hillerød', '07:00 - 22:00', 55.9279, 12.3008, 5, 3, 'Wash World Hillerød finder du på Industrivænget 3. Vi har 2 vaskehaller og 2 Vask Selv stationer klar til dig og din bil. Som kunde hos Wash World er det nemt og billigt at holde sin bil ren. Vi tilbyder både enkeltstående køb af bilvask samt medlemskab, hvor du kan vaske ubegrænset for et månedligt beløb. Vores fleksible løsning tilgodeser både dig, der vasker bil flere gange om ugen og dig, der kun vasker bil ved særlige lejligheder.'),
('loc008', 'Wash World Farum', 'Farum', 'Gammelgårdsvej 84, 3520 Farum', '07:00 - 22:00', 55.808, 12.3602, 1, 0, 'På Gammelgårdsvej 84 i Farum finder du Wash World med hele 3 vaskehaller, som er klar til at vaske din bil. Har du brug for bilvask på en nem, enkel og billig måde – hvor du ikke skal have kortet op af lommen hver gang? Så er et medlemskab hos Wash World lige noget for dig.

Dit månedlige medlemskab sikrer dig ubegrænset bilvask for et fast månedligt beløb. Vi bruger nummerpladescanning, så det er nemt at køre bilen i vaskehal – uden brug af kreditkort eller medlemskort.

Vælg mellem Guld, Premium og All Inclusive. Uanset hvilken du vælger, får du kvalitet for pengene i vores effektive vaskehaller. Det kan betale sig at have et medlemskab allerede efter vask nr. to hver måned.'),
('loc009', 'Wash World Holbæk', 'Holbæk', 'Springstrup 5, 4300 Holbæk', '07:00 - 22:00', 55.7183, 11.7049, 3, 1, 'Trænger din bil til lidt kærlig pleje, så kør ind til Wash World på Springstrup 5 i Holbæk. Her venter vores 3 vaskehaller og 2 Vask Selv stationer på dig og din bil. Hos Wash World får du en miljørigtig og skånsom bilvask i god kvalitet. Vi anvender den nyeste teknologi, så vi altid kan sikre dig en effektiv bilvaskeservice. Vi tilbyder 3 forskellige bilvaske, som du kan købe enten som enkeltvask eller på et månedligt abonnement, hvor du kan vaske så mange gange, du vil'),
('loc010', 'Wash World Kalundborg', 'Kalundborg', 'Holbækvej 74, 4400 Kalundborg', '07:00 - 22:00', 55.6791, 11.0735, 0, 0, 'I Kalundborg finder du Wash World bilvaskestation med to vaskehaller og én Vask Selv station, som har åbent 7-22 året rundt. Her kan du købe en billig bilvask i høj kvalitet. Vi benytter os af den nyeste teknologi for at sikre dig den bedste service. Vores vaskehaller over hele Danmark skyder op med lynets fart, og vi er i en rivende udvikling.'),
('loc011', 'Wash World Slagelse', 'Slagelse', 'Idagårdsvej 2, 4200 Slagelse', '07:00 - 22:00', 55.4038, 11.3546, 2, 1, 'På Idagårdsvej 2 i Slagelse finder du den ene af to Wash World stationer i Slagelse. På Idagårdsvej 2 har vi to vaskehaller, der er åbne 7-22 alle ugens dage. Med en perfekt placering i det sydlige Slagelse lige ved McDonald’s, Burger King og Bilka er det nemt at klare alle ærinder på én gang. Hos Wash World bruger vi kun den nyeste teknologi indenfor bilvask, som er miljørigtig, skånsom og sikrer dig en bilvask i god kvalitet.'),
('loc012', 'Wash World Ringsted', 'Ringsted', 'Nørregade 70, 4100 Ringsted', '07:00 - 22:00', 55.4421, 11.7901, 4, 2, 'Wash World er rigt repræsenteret i Ringsted, hvor du finder vores vaskehaller på hele to lokationer, nemlig Nørregade 70 og Frejasvej 43. Wash World Nørregade har den mest centrale beliggenhed af de to, med en placering tæt på Ringsted Sygehus. Vores to vaskehaller på Nørregade i Ringsted har åbent fra 7-22 hver dag i ugen. Hos Wash World er vi af den overbevisning, at det skal være nemt og billigt at holde sin bil ren. Derfor tilbyder vi både enkeltvask af din bil samt medlemskab, hvor du kan vaske ubegrænset for et månedligt beløb. Vores fleksible løsning tilgodeser både dig, der vasker bil flere gange om ugen og dig, der kun vasker bil ved særlige lejligheder.'),
('loc013', 'Wash World Vordingborg', 'Vordingborg', 'Valdemarsgade 57, 4760 Vordingborg', '07:00 - 22:00', 55.0081, 11.9105, 1, 0, 'På Valdemarsgade 57 i Vordingborg finder du Wash Worlds to vaskehaller. Det er nemt og billigt at vaske din bil hos Wash World – uanset om du køber en enkeltvask eller er medlem. Vælg mellem Guld, Premium og All Inclusive. Se vores forskellige bilvaske her. Som medlem behøver du ikke have penge op af lommen nogensinde. Du kører blot din bil i vaskehal, når det passer dig. Vores scanner registrerer din nummerplade og lukker porten op til vaskehallen, så du snart kan køre ud i verden med en skinnende ren bil.'),
('loc014', 'Wash World Nykøbing Falster', 'Nykøbing Falster', 'Guldborgsundcentret 32, 4800 Nykøbing Falster', '07:00 - 22:00', 54.769, 11.874, 3, 1, 'Trænger din bil til en vask, så læg vejen forbi Wash World på Guldborgsundcentret 32 i Nykøbing Falster. Her får du en miljørigtig og skånsom bilvask i god kvalitet i vores to vaskehaller. Vi anvender den nyeste teknologi, der sikrer dig en effektiv og økonomisk bilvask. Vi tilbyder 3 forskellige bilvaske.: Guld, Premium og All Inclusive. Du kan købe en enkeltvask eller vælge at få et månedligt abonnement, hvor du kan vaske så mange gange, du vil hver eneste måned for et fast beløb.'),
('loc015', 'Wash World Odense', 'Odense', 'Nyborgvej 343, 5220 Odense', '07:00 - 22:00', 55.395, 10.431, 2, 1, 'På Nyborgvej 343 i Odense SØ kan du vaske din bil fin og ren hos Wash World. Her finder du nemlig hele 3 vaskehaller, som har åbent 7-22. Søger du bilvask på en nem, enkel og billig måde, så er et medlemskab hos Wash World lige noget for dig. Her skal du ikke have kortet op af lommen hver gang – og du kan vaske ubegrænset for en fast pris.'),
('loc016', 'Wash World Odense SØ', 'Odense SØ', 'Ørbækvej 99, 5220 Odense SØ', '07:00 - 22:00', 55.383, 10.43, 0, 0, 'Bor du i Odense, har du rig mulighed for at vaske din bil hos Wash World. Vi har nemlig vaskestationer flere steder i Odense. På Ørbækvej 99 i Odense SØ står vores 2 vaskehaller klar til at vaske derudaf. Du får flere fordele hos Wash World – ikke mindst som medlem. Wash World tilbyder nemlig bilvask via medlemskab eller enkeltstående køb med betalingskort. Prøv en effektiv, tidsbesparende og miljørigtig bilvask med kort ventetid.'),
('loc017', 'Wash World Fredericia', 'Fredericia', 'Vejlevej 20, 7000 Fredericia', '07:00 - 22:00', 55.565, 9.752, 4, 2, 'Her hos Wash World forstår vi, at det ikke er alle, der har råd til at bruge en formue på bilvask. Derfor tilbyder vi en række overkommelige og effektive muligheder, der passer til dine behov og dit budget; vi har både grundige enkeltvaske og flere fordelagtige medlemskaber.

Vores tre forskellige medlemskaber giver dig mulighed for at vælge det serviceniveau, der passer dig. Vores priser starter ved 139 kr. for vores Guld-medlemskab, 169 kr. for Premium og kun 199 kr. for All Inclusive, hvor vi har samlet det allerbedste, vi har, for et ekstra skinnende og holdbart resultat.

Hvis du bare skal bruge en enkeltvask, har vi også mange billige, men grundige vaske at vælge mellem.

Så uanset om du er på udkig efter en grundlæggende vask eller en komplet vask med det hele, har vi en pakke til dit behov. Du kan finde byens bedste bilpleje i Fredericia på Vejlevej 20.'),
('loc018', 'Wash World Kolding', 'Kolding', 'Vejlevej 132, 6000 Kolding', '07:00 - 22:00', 55.49, 9.472, 1, 0, 'Trænger din bil til en vask, så kør ind til Wash World på Vejlevej 132 i Kolding. Vi anvender den nyeste teknologi, der sikrer dig en skånsom, effektiv og økonomisk bilvask. Du kan naturligvis nøjes med at købe en enkeltvask, men du kan også vælge at blive medlem af Wash World. Så kan du vaske så mange gange, du vil, hver eneste måned for et fast beløb. 

Wash Worlds to vaskehaller i Kolding er beliggende på Vejlevej 132 i den nordvestlige del af Kolding – lige overfor McDonald’s.'),
('loc019', 'Wash World Esbjerg', 'Esbjerg', 'Sædding Ringvej 6, 6710 Esbjerg', '07:00 - 22:00', 55.4765, 8.4474, 3, 1, 'På Sædding Ringvej 6 i Esbjerg kan du få ubegrænset bilvask fra kun 139 kr. pr. måned med et Wash World medlemskab. Vores 2 vaskehaller er åbne 7-22 alle ugens dage, og som medlem kører du blot bilen i vaskehal. Du skal ikke engang have penge eller kort op af lommen. Vi benytter os af nummerpladescanning, så du kan køre direkte ind i vaskehallen, hvis du er kørende i den bil, der er knyttet op på dit medlemskab. Du kan naturligvis også købe en bilvask uden at være medlem, så betaler du blot helt almindeligt med kreditkort.'),
('loc020', 'Wash World Silkeborg', 'Silkeborg', 'Nordre Ringvej 90, 8600 Silkeborg', '07:00 - 22:00', 56.17, 9.554, 2, 1, 'På Nordre Ringvej 90 i Silkeborg finder du Wash Worlds to vaskehaller, som er klar til at vaske din bil fin og ren. Vaskehallen er placeret centralt i Silkeborg og har åbent fra 7-22 hver dag i ugen. Hos Wash World anvender vi den nyeste teknologi, som giver en skånsom, effektiv og økonomisk bilvask.'),
('loc021', 'Wash World Viborg', 'Viborg', 'Falkevej 25, 8800 Viborg', '07:00 - 22:00', 56.453, 9.402, 5, 3, 'På Falkevej 25 midt i Viborg By finder du den ene af to Wash World stationer i Viborg. Her har vi to vaskehaller, der er åbne 7-22 alle ugens dage. Med en perfekt placering lige ved Indre Ringvej er det nemt at komme til og fra vores vaskehal. Hos Wash World bruger vi kun den nyeste teknologi indenfor bilvask, som er miljørigtig, skånsom og sikrer dig en bilvask i god kvalitet.'),
('loc022', 'Wash World Herning', 'Herning', 'Dæmningen 21, 7400 Herning', '07:00 - 22:00', 56.136, 8.973, 1, 0, 'I Herning har Wash World en bilvaskestation med to vaskehaller, som har åbent hver dag fra 7-22. Her kan du få en billig bilvask i høj kvalitet, som benytter sig af den nyeste teknologi for at sikre dig den bedste service. Vores vaskehaller over hele Danmark skyder op med lynets fart, da Wash World er i en rivende udvikling.

Kan du lide at passe og pleje din bil, så den altid tager sig pæn og nyvasket ud? Så kan du med fordel benytte dig af vores gode tilbud som medlem af Wash World, hvor du får ubegrænset bilvask for et fast månedligt beløb. Så kan du køre din bil i bilvask lige så ofte, du vil. På pladsen foran vaskehallen kan du benytte dig af vores forvask, hvor vi stiller sæbevand og børster til rådighed. Giv dine fælge, nummerplade og diverse kroge på bilen en ekstra tur med børsten, så du kan få løsnet den værste snavs.'),
('loc023', 'Wash World Randers', 'Randers', 'Messingvej 10, 8940 Randers', '07:00 - 22:00', 56.46, 10.036, 0, 0, 'På Udbyhøjvej 7 i Randers finder du Wash World med en god placering centralt i Randers. Vores vaskehal er klar til at vaske din bil skinnende ren, når du har fået nok af at køre rundt i en beskidt bil. Vil du gerne have en bilvask på en nem, enkel og billig måde, så er et medlemskab hos Wash World lige noget for dig. Hos os får du ubegrænset vask for et fast månedligt beløb.'),
('loc024', 'Wash World Aalborg Gug', 'Aalborg', 'Gammel Vissevej 1C, 9210 Aalborg', '07:00 - 22:00', 57.012, 9.911, 4, 2, 'Spuling, shampoo, hjulvask med børste, tørring og polering – det er hårdt arbejde at vaske bil. Hvorfor ikke lade Wash World klare bilvasken for dig? Kør bilen ind i vaskehallen på Gammel Vissevej 1C i Gug i Aalborg SØ. Her finder du to vaskehaller, som har åbent fra 7-22 hver dag. Fordelene hos os er en effektiv, tidsbesparende og miljørigtig bilvask med kort ventetid. Wash World tilbyder bilvask via medlemskab eller enkeltstående køb med betalingskort.'),
('loc025', 'Wash World Nørresundby', 'Nørresundby', 'Loftbrovej 2, 9400 Nørresundby', '07:00 - 22:00', 57.0726, 9.9195, 2, 1, 'Wash World Nørresundby finder du lige mellem Hirtshalsmotorvejen og Frederikshavnmotorvejen på Loftbrovej 2. Det er nemt at komme til og fra vores vaskehal, som har 7-22 hele året. Som kunde hos Wash World er det nemt og billigt at holde sin bil ren. Vi tilbyder både enkeltstående køb af bilvask samt medlemskab, hvor du kan vaske ubegrænset for et månedligt beløb. Vores fleksible løsning tilgodeser både dig, der vasker bil flere gange om ugen og dig, der kun vasker bil ved særlige lejligheder.


Wash World Nørresundby råder ikke kun over 2 automatiske vaskehaller. Du kan også vaske din bil med håndkraft, hvis du foretrækker dette. Du kan stå i tørvejr i vores overdækkede haller, og der er masser af plads til at komme rundt om din bil med udstyret. I vores Vask Selv vaskehal finder du børster og sæbe til at vaske bilen med. Som afslutning skyller du din bil med kalkfrit vand, der sikrer et pletfrit resultat – helt uden at du behøver at tørre efter. Prisen på Vask Selv er 6 kr. pr. minut.');

CREATE TABLE `wash_categories` (
  `wash_type` varchar(32) NOT NULL,
  `normal_price` decimal(10,2) NOT NULL,
  `subscription_price` decimal(10,2) NOT NULL,
  `wash_description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`wash_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `wash_categories`
(`wash_type`, `normal_price`, `subscription_price`, `wash_description`)
VALUES
('Guld', 59.00, 139.00, 'God og effektiv'),
('Premium', 89.00, 169.00, 'Ekstra grundig'),
('Brilliant', 119.00, 199.00, 'Bedste vask året rundt');

CREATE TABLE `users` (
  `user_pk` varchar(32) NOT NULL,
  `user_first_name` varchar(50) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password_hash` varchar(255) NOT NULL,
  `user_license_plate` varchar(20) NOT NULL,
  `user_phone` varchar(20) DEFAULT NULL,
  `primary_location_fk` varchar(32) DEFAULT NULL,
  `has_all_locations_access` tinyint(1) NOT NULL DEFAULT 0,
  `user_verified_at` datetime DEFAULT NULL,
  `user_verification_key` varchar(32) NOT NULL,
  `user_reset_password_key` varchar(64) NOT NULL,
  `user_created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_pk`),
  UNIQUE KEY `user_email` (`user_email`),
  KEY `primary_location_fk` (`primary_location_fk`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`primary_location_fk`) REFERENCES `wash_locations` (`location_pk`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `subscriptions` (
  `subscription_pk` varchar(32) NOT NULL,
  `user_fk` varchar(32) NOT NULL,
  `subscription_name` varchar(100) NOT NULL,
  `wash_type` varchar(32) DEFAULT NULL,
  `subscription_price` decimal(10,2) NOT NULL,
  `normal_price` decimal(10,2) DEFAULT NULL,
  `all_locations_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `subscription_started_at` datetime NOT NULL DEFAULT current_timestamp(),
  `subscription_active` tinyint(4) DEFAULT 1,
  PRIMARY KEY (`subscription_pk`),
  KEY `user_fk` (`user_fk`),
  KEY `wash_type` (`wash_type`),
  CONSTRAINT `subscriptions_ibfk_1` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_pk`) ON DELETE CASCADE,
  CONSTRAINT `subscriptions_ibfk_2` FOREIGN KEY (`wash_type`) REFERENCES `wash_categories` (`wash_type`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `payment_cards` (
  `payment_card_pk` varchar(32) NOT NULL,
  `user_fk` varchar(32) NOT NULL,
  `cardholder_name` varchar(100) NOT NULL,
  `card_last4` varchar(4) NOT NULL,
  `card_expiry` varchar(10) NOT NULL,
  `card_brand` varchar(50) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`payment_card_pk`),
  KEY `user_fk` (`user_fk`),
  CONSTRAINT `payment_cards_ibfk_1` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_pk`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `password_reset_tokens` (
  `reset_pk` varchar(32) NOT NULL,
  `user_fk` varchar(32) NOT NULL,
  `reset_key` varchar(64) NOT NULL,
  `used_at` int(11) DEFAULT 0,
  `created_at` int(11) NOT NULL,
  PRIMARY KEY (`reset_pk`),
  KEY `user_fk` (`user_fk`),
  CONSTRAINT `password_reset_tokens_ibfk_1` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_pk`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `wash_history` (
  `wash_pk` varchar(32) NOT NULL,
  `user_fk` varchar(32) NOT NULL,
  `location_fk` varchar(32) NOT NULL,
  `wash_type` varchar(100) NOT NULL,
  `normal_price` decimal(10,2) NOT NULL,
  `subscription_price` decimal(10,2) NOT NULL,
  `washed_at` int(11) NOT NULL,
  PRIMARY KEY (`wash_pk`),
  KEY `user_fk` (`user_fk`),
  KEY `location_fk` (`location_fk`),
  CONSTRAINT `wash_history_ibfk_1` FOREIGN KEY (`user_fk`) REFERENCES `users` (`user_pk`) ON DELETE CASCADE,
  CONSTRAINT `wash_history_ibfk_2` FOREIGN KEY (`location_fk`) REFERENCES `wash_locations` (`location_pk`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;
