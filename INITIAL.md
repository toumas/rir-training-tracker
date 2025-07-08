## FEATURE:

# RIR Training Tracker App

I've created a comprehensive **RIR Training Tracker** web application that supports full CRUD operations for managing your Reps in Reserve training program. The app provides an intuitive interface for logging workouts, tracking progress, and analyzing your training intensity using the scientifically-backed RIR methodology.

## What is RIR Training?

**Reps in Reserve (RIR)** is a training method that measures exercise intensity by estimating how many additional repetitions you could perform before reaching muscular failure[1][2]. This approach allows you to:

- **Control training intensity** precisely without always training to failure[1]
- **Prevent overtraining** while still providing sufficient stimulus for muscle growth[1]
- **Track progress** through measurable metrics that adapt to daily performance variations[2]
- **Autoregulate** your training based on how you feel each day[3]

The RIR scale typically ranges from 0 (complete failure) to 5+ (very easy, many reps left in reserve)[4]. Research shows that training with **RIR 0-2 is optimal for hypertrophy**, while **RIR 2-4 works well for strength development**[5].

## App Features & CRUD Operations

### **Create Operations**
- **New Workouts**: Log exercises with sets, reps, weight, and RIR ratings (0-5 scale)
- **Custom Exercises**: Add your own exercises to the database with muscle group categorization
- **Workout Templates**: Build reusable workout routines

### **Read Operations**
- **Workout History**: View all previous training sessions with detailed metrics
- **Exercise Database**: Browse 10+ pre-loaded exercises with instructions and muscle group targeting
- **Progress Analytics**: Track RIR trends and training intensity over time
- **Dashboard Statistics**: Overview of total workouts, average RIR, and recent activity

### **Update Operations**
- **Edit Workouts**: Modify existing workout data including sets, reps, weight, and RIR ratings
- **Update Exercise Details**: Change workout names, notes, and exercise selections
- **Adjust Training Data**: Fine-tune historical records for accuracy

### **Delete Operations**
- **Remove Individual Sets**: Delete specific sets from exercises
- **Delete Exercises**: Remove entire exercises from workouts
- **Delete Workouts**: Remove complete training sessions with confirmation dialogs
- **Clear Data**: Reset app data when needed

## Key App Components

### **Dashboard**
- Quick overview of training statistics
- Recent workout summary
- Easy navigation to all app sections

### **Exercise Database**
Pre-loaded with essential strength training exercises[6]:
- **Compound movements**: Bench Press, Squat, Deadlift, Pull-ups
- **Isolation exercises**: Dumbbell Curls, Tricep Dips, Shoulder Press
- **Bodyweight options**: Push-ups, Pull-ups
- Each exercise includes muscle group, equipment needed, and basic instructions

### **Workout Creation**
- Intuitive form for logging training sessions
- RIR scale with helpful tooltips explaining each rating
- Weight and rep tracking for progressive overload
- Notes section for additional context

### **Progress Analytics**
- Visual representation of RIR trends over time
- Color-coded intensity indicators:
  - **Red (RIR 0-1)**: High intensity, near failure
  - **Orange (RIR 2-3)**: Moderate intensity
  - **Green (RIR 4-5)**: Low intensity, easy sets

## Technical Implementation

The app is built as a **multi-page application** using Next.js with App Router, TypeScript, ESLint and Tailwind CSS with:

- **Responsive design** that works on both desktop and mobile devices
- **Modern UI** with fitness-themed color scheme and clean typography
- **Form validation** to ensure data integrity
- **Confirmation dialogs** for destructive operations
- **Search and filter functionality** for finding specific workouts or exercises

### Data Storage Considerations

The app utilizes the browser's localStorage API to persist data between sessions[7][8]. 

Local storage provides approximately **5MB of storage space per domain**[9][10], which is sufficient for storing thousands of workout sessions. The app's data structure is designed to be localStorage-compatible and can be easily modified to include persistence when deployed to your own web server.

## How to Use the App

1. **Start on the Dashboard** to see your training overview
2. **Create a New Workout** by selecting exercises and logging sets with RIR ratings
3. **View Workout History** to track your progress over time
4. **Edit Previous Workouts** to correct or update training data
5. **Browse the Exercise Database** to discover new movements
6. **Check Analytics** to visualize your training intensity trends

The **RIR guide** is built into the interface, showing exactly what each rating means for your training intensity[4][11].

This comprehensive tool will help you implement the scientifically-backed RIR methodology into your training routine, allowing for better autoregulation and more effective progression toward your fitness goals[1][3][5].

## EXAMPLES:

None.

## DOCUMENTATION:

[1] https://alphaprogression.com/en/blog/reps-in-reserve
[2] https://www.eatthis.com/reps-in-reserve/
[3] https://www.thepfca.com/training-methods-reps-in-reserve-explained/
[4] https://fitbod.zendesk.com/hc/en-us/articles/360033133174-Reps-in-Reserve-RiR-Formerly-Exertion-Rating-RPE
[5] https://spleeft.app/reps-in-reserve-rir-training-guide/
[6] https://fitnessprogramer.com/20-best-strength-training-exercises/
[7] https://rxdb.info/articles/localstorage.html
[8] https://dev.to/oghenetega_adiri/indexeddb-vs-localstorage-when-to-use-which-2blf
[9] https://app.studyraid.com/en/read/12378/399685/storage-limits-and-browser-constraints
[10] https://app.studyraid.com/en/read/12382/399839/storage-size-limitations-and-browser-compatibility
[11] https://blog.nasm.org/reps-in-reserve
[12] https://help.strengthlog.com/help-article/how-to-activate-rpe-rir-in-your-workouts/
[13] https://www.menshealth.com/fitness/a64312392/reps-in-reserve-meaning/
[14] https://intercom.help/thetrainingplan/en/articles/2920138-reps-in-reserve-rir
[15] https://www.youtube.com/watch?v=wy1Z6JbdLoA
[16] https://onfit.edu.au/resistance-training-intensity-tracking/
[17] https://www.eatthis.com/reps-in-reserve
[18] https://learning.ripe.net/w/courses/1-lir-training-course/321
[19] https://www.reddit.com/r/weightroom/comments/xjfdsv/reps_in_reserve_rir_for_dummies_stronger_by/
[20] https://intercom.help/myfitcoach/en/articles/5433050-how-do-i-deal-with-the-training-prescription-for-repetitions-weight-and-rir-in-an-exercise
[21] https://gymaware.com/reps-in-reserve/
[22] https://www.climbstrong.com/resource-posts/get-strong-using-reps-in-reserve
[23] https://www.metric.coach/user-guide/rpe-and-rir
[24] https://www.youtube.com/watch?v=87F201AYILU
[25] https://pubmed.ncbi.nlm.nih.gov/36135029/
[26] https://appinventiv.com/blog/fitness-app-features/
[27] https://www.youtube.com/watch?v=BBBGY5X1Yvk
[28] https://www.garagegymreviews.com/best-workout-app-for-beginners
[29] https://www.moontechnolabs.com/blog/features-for-fitness-app/
[30] https://roadmap.sh/projects/fitness-workout-tracker
[31] https://apps.microsoft.com/detail/9WZDNCRDQJNS?hl=en-US
[32] https://www.vantagefit.io/en/blog/health-and-wellness-app-features/
[33] https://github.com/Valcheez/CRUD-Fitness-Tracker
[34] https://apps.apple.com/tj/app/strengthapp-strengthfarm/id1540857080
[35] https://www.nimbleappgenie.com/blogs/essential-fitness-app-features/
[36] https://dev.to/wendyver/crud-operations-what-are-they-and-how-can-i-use-them-589i
[37] https://www.garagegymreviews.com/best-workout-apps
[38] https://www.exercise.com/grow/what-features-should-a-fitness-app-have/
[39] https://www.youtube.com/watch?v=QxFsPv3b2Ws
[40] https://www.garagegymreviews.com/best-weightlifting-app
[41] https://www.fitbudd.com/post/15-must-have-features-in-a-custom-gym-app
[42] https://github.com/TimothyJan/Workout-Tracker-Web-App
[43] https://apps.apple.com/us/app/strength-training-by-m-m/id1302056349
[44] https://attractgroup.com/blog/10-essential-features-for-a-fitness-app-build-a-fitness-app-today/
[45] https://github.com/imason5/FitQuest
[46] https://www.api-ninjas.com/api/exercises
[47] https://stackoverflow.com/questions/68758367/what-is-the-correct-data-structure-for-a-workout-journal
[48] https://www.reddit.com/r/datasets/comments/1fpksy2/are_there_any_good_fitnessexercise_apis_out_there/
[49] https://www.reddit.com/r/SQL/comments/tnin6m/proper_database_design_for_a_workout_tracker/
[50] https://www.mindbodygreen.com/articles/your-guide-to-strength-training?srsltid=AfmBOoq5kWCLXxJdXxwAD_7Xl_30J3UY14F0Ak0VTgagdLZ0MBXkTiTh
[51] https://github.com/cyberboyanmol/exercisedb-api
[52] https://www.dittofi.com/learn/how-to-design-a-data-model-for-a-workout-tracking-app
[53] https://www.spartan.com/blogs/unbreakable-training/best-exercises-for-functional-strength
[54] https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
[55] https://stackoverflow.com/questions/23024126/specific-database-structuring-for-fitness-tracking
[56] https://www.strengthlog.com/exercise-directory/
[57] https://www.youtube.com/watch?v=S7QRxgOZ2U0
[58] https://www.back4app.com/tutorials/how-to-build-a-database-schema-for-a-fitness-tracking-application
[59] https://en.wikipedia.org/wiki/List_of_weight_training_exercises
[60] https://github.com/gregdardis/fitness-api
[61] https://1df.co/designing-data-structure-to-track-workouts/
[62] https://www.nhs.uk/live-well/exercise/strength-exercises/
[63] https://exrx.net/Store/Other/Licensing
[64] https://www.w3schools.com/dsa/dsa_exercises.php
[65] https://writtify.com/stop-using-localstorage-heres-what-you-should-use-instead/
[66] https://dev.to/armstrong2035/9-differences-between-indexeddb-and-localstorage-30ai
[67] https://stackoverflow.com/questions/6909957/alternatives-to-html5-localstorage
[68] https://www.codeproject.com/ref/dom/indexeddb_api/browser_storage_limits_and_eviction_criteria
[69] https://www.geeksforgeeks.org/javascript/difference-between-localstorage-and-indexeddb-in-javascript/
[70] https://www.sitepoint.com/client-side-storage-options-comparison/
[71] https://dev.to/pooja_garva/browser-storage-quotas-limits-to-store-datafiles-inside-browsers-204o
[72] https://softwareengineering.stackexchange.com/questions/219953/how-is-localstorage-different-from-indexeddb
[73] https://www.g2.com/products/google-local-ssd/competitors/alternatives
[74] https://rxdb.info/articles/indexeddb-max-storage-limit.html
[75] https://dev.to/tene/localstorage-vs-indexeddb-javascript-guide-storage-limits-best-practices-fl5
[76] https://www.cloudwards.net/diy-cloud-storage-tools/
[77] https://dev.to/sidramaqbool/web-storage-purpose-usage-benefits-risks-limitations-with-examples-o46
[78] https://www.reddit.com/r/sveltejs/comments/15rj12h/any_downsides_to_using_indexeddb_vs_localstorage/
[79] https://superuser.com/questions/1670085/replacing-local-server-and-network-drives-with-a-cloud-storage-equivalent
[80] https://stackoverflow.com/questions/10988569/storage-limits-on-chrome-browser

## OTHER CONSIDERATIONS:

None.
