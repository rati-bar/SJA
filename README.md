# Steve Jobs American Academy — Management Platform (Wireframes)

HTML wireframes / clickable prototype for the SJA multi-branch training academy
management platform. Built for **Etape 0 — UX/UI design** of the SOW.

> _"I don't follow, I lead — preparing our students not just to keep up with the
> future, but to shape it."_

## Structure

| File | Role | აღწერა |
|------|------|--------|
| `index.html` | — | პირველი გვერდი: როლის არჩევის landing page |
| `admin.html` | ადმინისტრატორი | პლატფორმის სრული მართვა |
| `trainer.html` | ტრენერი | სასწავლო პროცესის მართვა |
| `student.html` | სტუდენტი | პირადი კაბინეტი |
| `assets/sja.css` | — | ბრენდის დიზაინ-სისტემა (SJA brandbook) |
| `assets/sja.js` | — | navigation / tab switching (dependency-free) |
| `assets/logo.svg` | — | SJA ლოგო |

პირველი გვერდიდან შესაძლებელია თითოეული როლის ინტერფეისში გადასვლა. თითოეულ
role-ს აქვს გვერდითი მენიუ, საიდანაც იხსნება ამ როლის ფუნქციონალის ცალკეული ეკრანები.

## Roles & functionality covered

### 🛠️ ადმინისტრატორი (`admin.html`)
Dashboard · ფილიალები (სემესტრის ვადები, ესკალაციის ლოგიკა) · მოსწავლეთა ბაზა
(რეგისტრაცია, პროფილი, გადახდის სტატუსი) · ტრენერების ბაზა · სასწავლო ჯგუფები და
ლექციების განრიგი · ჩარიცხვები და ფინანსები (ავტომ. მიბმა, დაუხარისხებელი ჩარიცხვები,
Fina ინტეგრაცია, KPI) · დავალიანებები · რეპორტები (შაბლონები, განრიგი, არქივი) ·
შეფასებები/გამოკითხვები · დოკუმენტების საცავი · შეტყობინებები (SMS/Voice/Email,
Citynet, 4-ეტაპიანი ესკალაცია) · AI ცოდნის ბაზა · როლები და წვდომები · პარამეტრები.

### 🎓 ტრენერი (`trainer.html`)
Dashboard · ჩემი ჯგუფები · განრიგი · დასწრება და შეფასება · სასწავლო მასალა ·
რეპორტების შევსება ვადებით · თვითშეფასება და მიღებული შეფასებები · AI ასისტენტი · პროფილი.

### 🧑‍💻 სტუდენტი (`student.html`)
Dashboard · განრიგი · ჩემი კურსი (მოდულები) · ქულები/დასწრება · გადახდები (ბარათით /
საბსქრიფშენ, ისტორია, ქვითრები) · ტრენერის შეფასება · დოკუმენტები · AI დახმარება ·
პროფილი (პაროლის დაყენება).

## Brand

SJA brandbook-იდან აღებული: Savoy Blue `#4E62AA`, Yellow Green `#AACB5C`,
Hunyadi Yellow `#E5A436`, Cerise `#CF435E`, navy `#22315F`.

## Usage

გახსენით `index.html` ბრაუზერში. სტატიკური ფაილებია — build არ სჭირდება.
