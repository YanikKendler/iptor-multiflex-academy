package repository;

import dtos.VideoOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Video;
import model.VideoFile;
import net.bramp.ffmpeg.FFmpeg;
import net.bramp.ffmpeg.FFmpegExecutor;
import net.bramp.ffmpeg.FFprobe;
import net.bramp.ffmpeg.builder.FFmpegBuilder;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@Transactional
@ApplicationScoped
public class VideoRepository {
    @Inject
    EntityManager em;

    public void create(Video video) {
        em.persist(video);
    }

    public void update(Video video) {}

    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<VideoOverviewDTO> getAll() {
        List<Video> videos = em.createQuery("select v from Video v", Video.class).getResultList();

        return videos.stream()
                .map(v -> new VideoOverviewDTO(v.getVideoId(), v.getTitle(), v.getDescription(), v.getTags(), v.getColor(), v.getDurationSeconds()))
                .toList();
    }

    public Video getById(Long id){
        return em.find(Video.class, id);
    }


    public void uploadVideo(InputStream uploadedInputStream) throws Exception {
        VideoFile videoFile = new VideoFile();
        em.persist(videoFile);

        saveVideo(uploadedInputStream, videoFile);

        processVideo(videoFile);
    }

    public void saveVideo(InputStream uploadedInputStream, VideoFile videoFile) throws Exception {
        try (FileOutputStream out = new FileOutputStream("uploads/upload-" + videoFile.getId() + ".mp4")) {
            int read;
            byte[] bytes = new byte[1024];
            while ((read = uploadedInputStream.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
        }
    }

    public void processVideo(VideoFile videoFile) {
        new File("processed/video-" + videoFile.getId()).mkdirs();

        FFmpegBuilder builder = new FFmpegBuilder()
            .setInput("uploads/upload-" + videoFile.getId() + ".mp4")
            .overrideOutputFiles(false)

            .addOutput("processed/video-" + videoFile.getId() + "/source.mpd")
            .setFormat("dash")

            .setAudioCodec("copy")
            .setVideoCodec("copy")

            .addExtraArgs("-min_seg_duration", "30")
            .addExtraArgs("-use_template", "1")
            .addExtraArgs("-use_timeline", "1")
            .addExtraArgs("-init_seg_name", "$RepresentationID$-init.m4s")
            .addExtraArgs("-media_seg_name", "$RepresentationID$-$Time$.m4s")
            .done();

        try {
            FFmpeg ffmpeg = new FFmpeg("tools/ffmpeg.exe");
            FFprobe ffprobe = new FFprobe("tools/ffprobe.exe");

            FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);

            // Run a one-pass encode
            executor.createJob(builder).run();

            // Or run a two-pass encode (which is better quality at the cost of being slower)
            executor.createJob(builder).run();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public File getVideoChunk(Long videoId, String fileName) throws Exception {
        Video video = em.find(Video.class, videoId);
        return new File("processed/video-" + video.getVideoFile().getId() + "/" + fileName);
    }

    public void linkVideoFile(Long videoId, Long fileId) {
        Video video = em.find(Video.class, videoId);
        VideoFile videoFile = em.find(VideoFile.class, fileId);
        video.setVideoFile(videoFile);
    }
}
