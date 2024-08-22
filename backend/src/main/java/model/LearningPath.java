package model;

import dtos.LearningPathOverviewDTO;
import enums.VisibilityEnum;
import jakarta.inject.Inject;
import jakarta.persistence.*;
import repository.UserRepository;

import java.util.LinkedList;
import java.util.List;

@Entity
public class LearningPath extends Content {
    @OneToMany(fetch = FetchType.EAGER)
    private List<LearningPathEntry> entries = new LinkedList<>();

    public LearningPath(String title, String description, VisibilityEnum visibility, List<LearningPathEntry> entries, String color, User user) {
        super(title, description, visibility);
        this.entries = entries;
        this.setColor(color);
        this.setUser(user);
    }

    public LearningPath(String title, String description, VisibilityEnum visibility) {
        super(title, description, visibility);
    }

    public LearningPath() {
        super();
    }

    public void setEntries(List<LearningPathEntry> entries) {
        this.entries = entries;
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
