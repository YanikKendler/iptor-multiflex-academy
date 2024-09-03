# Feature List

## Dashboard

- Filtern
    - Tags suchen
    - Tags auswählen
- Suchen
    - nach alle ansehbaren Videos oder Learning Paths
- Continue Watching
    - Content den man begonnen hat und noch nicht abgeschlossen hat
        - wenn man kein interesse mehr an dem content hat kann man diesen ignorieren und aus der liste entfernen
    - Content der gesaved wurde
- Assigned Content
    - Content der von einem Übergeordneten an dich zugewiesen wurde
- Suggested videos and learning paths
    - Content den man noch nicht angesehen hat der ähnlich zu deinem gesehen Content ist
    - Die Vorschläge bassieren auf Sterne-Bewertungen des Content und Tags von bereits angesehen Videos
- Notifications
    - man bekommt eine email gesendet wenn man eine notification erhält
    - man erhält benachrichtungen bei
        - updates zu relevantem(gespeichertem/zugewiesenem) content
        - neuer zuweisung
        - als mitarbeiter wenn ein neuer video request gestellt wurde
        - als kunde wenn sein video request abgeschlossen wurde
        - als admin wenn neuer content erstellt wurde den man approven sollte
        - als employee wenn sein erstellter content approved wurde
        - wenn jemand auf einem von dir erstellten video kommentiert
    - man kann zu der relevanten seite navigieren
    - man kann die notification als gelesen makieren
    - werden rechts oben bei der navigation angezeigt
- Navigation
    - hier kann man zu der internen area navigieren (diese werden nur für employees oder admins angezeigt)
        - videos, learning paths, video requests
    - admins, employees und manger(kunden ohne vorgesetzten) können “manage-users” sehen
    - jeder darf video requests stellen
        - wenn es zu einem bestimmten thema noch kein video gibt kann ein user hier einen request and die employees und admins stellen
    - logout

## Sign In

- mit email und passwort einloggen
- oder mit email passwort und Nutzernamen neu registrieren
- alle neu registrierten User sind standardmäßig Customer

## Videos

- video erstellen
    - title & description
    - video file hochladen
    - fragen und antworten erstellen und diese als korrekt markieren
    - tags hinzufügen, völlig neue erstellen, oder löschen
    - video color und visibility ändern
        - visiblity ist entweder self, everyone, customer oder internal
- löschen
- bearbeiten
- zu ihnen hin-navigieren
- die übersichts daten ansehen (title, views, rating, visibility, question anzahl, tags)
- wenn ein video von einem employee  neu erstellt wird muss dieses von dem admin approved werden bevor die visibility von “self” geändert werden kann

## Learningpaths

- alle Features wie bei Videos (erstellen, löschen, bearbeiten, navigieren, daten sehen, approval system)
- erstellen/bearbeiten
    - besonderheit, hier können videos hinzugefügt werden und deren anordnung bearbeitet werden welche dann teil des lernpfades sind
    - Fragen können keine hinzugefügt werden, diese funktionieren nur auf Video Ebene

## Manage Users

- der admin sieht alle user und kann zwischen employees und customers wechseln
- alle anderen user sehen alle untergeordneten in einem baum
- der admin kann hier die user verwalten
    - customer zu employee machen und umgekehrt
    - deren supervisor und deputy supervisor zuteilen
- die supervisor können jeweils deren untergeordneten, content assignen und deren fortschritt sehen.
    - assigned content kann natürlich auch wieder entfernt werden

## Video Requests

- hier werden die video requests von den usern angezeigt.
- diese kann man dann zu einem video zuteilen und abschließen
- oder ablehnen

## Show User Statistics

- Statistiken in den Einstellungen einsehen
- Wenn du die Statistiken deiner Untergebenen ansehen möchtest, kann man diese im manage-users menü anzeigen

## Video detail page

- hier kann man sich das video ansehen
    - es wird in Intervallen der progress getracked
- man kann das video mit 1-5 sternen bewerten
- man kann das video speichern (wird in “continue watching” angezeigt
- wenn es noch nicht approved wurde vom admin, kann dieser das video hier auch approven
- kommentare schreiben, löschen, bearbeiten und ansehen
    - der video creater und admin kann jeden kommentar löschen

## Quiz

- ein quiz besteht aus fragen und antworten
- das Quiz wird unter jedem video und im lernpfad angezeigt
- man kann pro frage die antworten auswählen
- danach submitted man seine auswahl und bekommt die Lösung für die aktuelle frage angezeigt
    - falsche, richtige und fehlende antworten
- der progress im quiz wird immer im session storage gespeichert
    - wenn man das quiz verlässt und wieder zurückkommt kann man dort weiter machen wo man aufgehört hat
- wenn ein quiz abgeschlossen worden ist wird das Resultat in der Datenbank gespeichert
    - Anzahl der richtigen antworten
    - score in Prozent der punkte(richtige + nicht angekreuzte falsche) durch mögliche punkte(Anzahl der Antwortmöglichkeiten)
    - man kann seine Ergebnisse immer wieder ansehen
    - es wird immer der beste score in der datenbank gespeichert
- ein beendetes quiz kann neu gestartet werden

## Learning Path

- ein learning path besteht aus mehreren Videos
- man schaut immer ein Video, schließt das Quiz dazu mit über 80% ab und kann dann zum nächsten Video weitergehen
- natürlich ist es auch möglich zu den vorherigen videos zu gehen.
- die videos die noch nicht freigeschaltet sind können auch nicht angesehen werden im learning path
- in der sidebar kann zwischen videos navigiert werden
- wenn alle quizzes abgeschlossen sind sieht man eine finale statistik