function init(basePath) {
    var action = new RGuiAction(qsTranslate("Circle3P", "&3 Points"),
        RMainWindowQt.getMainWindow());
    action.setRequiresDocument(true);
    action.setScriptFile(basePath + "/Circle3P.js");
    action.setIcon(basePath + "/Circle3P.svg");
    action.setStatusTip(qsTranslate("Circle3P", "Draw circle from 3 points"));
    action.setDefaultShortcut(new QKeySequence("c,3"));
    action.setDefaultCommands(["Circle3P", "c3"]);
    action.setSortOrder(500);
    EAction.addGuiActionTo(action, Circle, true, true, true);
}
