package repository;

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
import net.bramp.ffmpeg.probe.FFmpegProbeResult;
import net.bramp.ffmpeg.probe.FFmpegStream;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

@ApplicationScoped
@Transactional
public class VideoFileRepository {
    @Inject
    EntityManager em;

    /**
     * This function is the starting point of video upload process. It takes all further steps to process and store the video.
     *
     * @param file the byte data of the uploaded video from the form on the client
     * @param filename the name of the uploaded video file from the client
     */
    public VideoFile uploadVideo(InputStream file, String filename) throws Exception {
        //creates a VideoFile object that identifies and stores all the metadata for the video
        VideoFile videoFile = new VideoFile(filename);
        em.persist(videoFile);

        File tempDirectory = new File("processed" + File.separator + "video-" + videoFile.getVideoFileId());
        if(tempDirectory.exists())
            throw new IOException("Directory already exists for video file " + videoFile.getVideoFileId());

        //temporarily stores the uploaded video in the "uploads" folder so that the ffmpeg tool can process it
        tempSaveVideo(file, videoFile);

        try{
            //transform the stored video into smaller chunks that can be streamed one by one
            processVideo(videoFile);
        }catch (IOException e){
            removeTempSavedVideo(videoFile);
            throw e;
        }

        //remove the now unneeded temporary video file
        removeTempSavedVideo(videoFile);

        return videoFile;
    }

    /**
     * Takes the uploaded byte data from the form on the client and writes it into a single video file in the "uploads"
     * folder. This file is temporary and is only used as an input for further processing by ffmpeg - see "processVideo()"
     *
     * @param uploadedInputStream byte data of the uploaded video
     * @param videoFile contains an id for and file extension of the uploaded video
     */
    public void tempSaveVideo(InputStream uploadedInputStream, VideoFile videoFile) throws Exception {
        try (FileOutputStream out = new FileOutputStream("uploads" + File.separator + "upload-" + videoFile.getVideoFileId() + "." + videoFile.getOriginalFileExtension())) {
            int read;
            byte[] bytes = new byte[1024];
            while ((read = uploadedInputStream.read(bytes)) != -1) {
                out.write(bytes, 0, read);
            }
        }
        catch (Exception e) {
            throw new IOException("Could not tempsave video file " + videoFile.getVideoFileId() + " - " + e.getMessage(), e);
        }
    }

    /**
     * Removes the initial uploaded single video file from the "uploads" folder
     * @param videoFile identifies the video file to be removed
     */
    public void removeTempSavedVideo(VideoFile videoFile){
        File file = new File("uploads" + File.separator + "upload-" + videoFile.getVideoFileId() + "." + videoFile.getOriginalFileExtension());
        file.delete();
    }

    /**
     * Process the video file to create a DASH manifest and video chunks (web technology for streaming video)
     * the chunks will be requested one by one, by the client - see "getVideoChunk()".
     * Additionally, metadata is extracted from the video and stored in the videoFile object.
     *
     * For these tasks the ffmpeg tool and a wrapper library is used.
     *
     * @param videoFile contains id and file extension of the uploaded video
     */
    public void processVideo(VideoFile videoFile) throws IOException {

        String filePath = "uploads" + File.separator + "upload-" + videoFile.getVideoFileId() + "." + videoFile.getOriginalFileExtension();

        try {
            FFmpeg ffmpeg = new FFmpeg("tools" + File.separator + "ffmpeg.exe");
            FFprobe ffprobe = new FFprobe("tools" + File.separator + "ffprobe.exe");

            //read metadata from videofile and store them in the db
            FFmpegProbeResult probeResult = ffprobe.probe(filePath);
            FFmpegStream stream = probeResult.getStreams().get(0);
            videoFile.setDurationSeconds((long) stream.duration);
            //get the size of the file and write to the videoFile
            videoFile.setSizeBytes(new File(filePath).length());

            //creates a directory for the video chunks to be stored in
            new File("processed" + File.separator + "video-" + videoFile.getVideoFileId()).mkdirs();

            //TODO update file path in case of linux deployment
            //transform the temporary stored videos into a DASH manifest and chunks
            FFmpegBuilder builder = new FFmpegBuilder()
                    .setInput(filePath)
                    .overrideOutputFiles(false)

                    .addOutput("processed/" + "video-" + videoFile.getVideoFileId() + "/manifest.mpd")
                    .setFormat("dash")

                    .setAudioCodec("copy")
                    .setVideoCodec("copy")

                    //arguments for the exact format of the chunks and manifest
                    .addExtraArgs("-min_seg_duration", "30")
                    .addExtraArgs("-use_template", "1")
                    .addExtraArgs("-use_timeline", "1")
                    .addExtraArgs("-init_seg_name", "$RepresentationID$-init.m4s")
                    .addExtraArgs("-media_seg_name", "$RepresentationID$-$Time$.m4s")
                    .done();

            FFmpegExecutor executor = new FFmpegExecutor(ffmpeg, ffprobe);
            executor.createJob(builder).run();
        }
        catch (IOException e) {
            throw new IOException("could not process video file " + videoFile.getVideoFileId() + " - " + e.getMessage(), e);
        }
        catch (Exception e) {
            throw new IOException("File upload failed - " + e.getMessage(), e);
        }
    }

    /**
     * This function is called by the streamer in the client to request small chunks of the video one by one. By doing
     * this, the client doesn't have to download all 20 minutes of a given video all at once but can instead request the
     * next 2 chunks or so and when the first chunk is watched, request the next one.
     *
     * @param videoId chunk names aren't unique and therefore need to be identified by the videoId they belong to
     * @param fileName the streamer in the frontend reads the name of the next chunk from the manifest file and passes this along
     *
     * @return the requested video chunk
     */
    public File getVideoFragment(Long videoId, String fileName) throws Exception {
        Video video = em.find(Video.class, videoId);
        return new File("processed" + File.separator + "video-" + video.getVideoFile().getVideoFileId() + File.separator + fileName);
    }

    public void deleteVideoFile(Long fileId) throws IOException {
        FileUtils.deleteDirectory(new File( "processed" + File.separator + "video-" + fileId));

        VideoFile videoFile = em.find(VideoFile.class, fileId);
        if (videoFile != null) {
            em.createQuery("UPDATE Video v SET v.videoFile = null WHERE v.videoFile.videoFileId = :fileId")
                    .setParameter("fileId", fileId)
                    .executeUpdate();

            em.remove(videoFile);
        }
    }
}
