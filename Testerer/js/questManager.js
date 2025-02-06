export class QuestManager {
  /**
   * @param {EventManager} eventManager – менеджер событий (для работы с дневником)
   * @param {App} appInstance – ссылка на основной объект App (для вызова compareCurrentFrame())
   */
  constructor(eventManager, appInstance) {
    this.eventManager = eventManager;
    this.app = appInstance;
  }

  // ЗАМЕНЯЕМ весь метод activateMirrorQuest() на следующий:
  async activateMirrorQuest() {
    if (!this.eventManager.isEventLogged("mirror_quest")) {
      console.log("🔔 Активируем задание mirror_quest...");
      await this.eventManager.addDiaryEntry("mirror_quest");
    }
  }

  // ЗАМЕНЯЕМ или ДОБАВЛЯЕМ метод checkMirrorQuestOnCamera():
  async checkMirrorQuestOnCamera() {
    const hasQuest = this.eventManager.isEventLogged("mirror_quest");
    const doneQuest = this.eventManager.isEventLogged("mirror_done");
    if (hasQuest && !doneQuest) {
      console.log("🪞 Mirror quest активно. Запускаем проверку...");
      // Ждём 3 секунды, чтобы камера «устоялась»
      setTimeout(async () => {
        const success = await this.app.compareCurrentFrame();
        if (success) {
          if (!this.eventManager.isEventLogged("mirror_done")) {
            await this.eventManager.addDiaryEntry("mirror_done");
          }
          alert("✅ Задание «подойти к зеркалу» выполнено!");
        } else {
          alert("❌ Нет совпадения. Попробуйте ещё раз!");
        }
      }, 3000);
    }
  }
}
