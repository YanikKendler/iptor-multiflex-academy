package model;

import enums.VisibilityEnum;
import jakarta.persistence.*;

import java.util.LinkedList;
import java.util.List;

@Entity
public class LearningPath extends Content {
    @OneToMany
    private List<LearningPathEntry> entries = new LinkedList<>();

    public LearningPath(String title, String description, VisibilityEnum visibility) {
        super(title, description, visibility);
    }

    public LearningPath() {
        super();
    }

    public List<LearningPathEntry> addEntry(LearningPathEntry entry) {
        entries.add(entry);
        return entries;
    }

    public List<LearningPathEntry> removeEntry(LearningPathEntry entry) {
        entries.remove(entry);
        return entries;
    }

    public List<LearningPathEntry> getEntries() {
        return entries;
    }
}
