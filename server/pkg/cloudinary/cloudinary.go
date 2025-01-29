package cloudinary

import (
	"context"
	"fmt"
	"mime/multipart"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/admin"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

type Cloudinary struct {
	cld *cloudinary.Cloudinary
}

func NewCloudinaryService() (*Cloudinary, error) {
	cld, err := cloudinary.New()
	if err != nil {
		return nil, fmt.Errorf("failed to intialize cloudinary: %w", err)
	}

	return &Cloudinary{
		cld: cld,
	}, nil
}

func (c *Cloudinary) UploadNewTaskFiles(ctx context.Context, files []*multipart.FileHeader, taskID string) ([]*uploader.UploadResult, error) {
	folder, err := c.cld.Admin.CreateFolder(ctx, admin.CreateFolderParams{Folder: fmt.Sprintf("taskmate/%s", taskID)})
	if err != nil {
		return nil, fmt.Errorf("error while creating folder on cloudinary: %w", err)
	}

	type result struct {
		uploaded *uploader.UploadResult
		Err      error
	}

	resultChan := make(chan result, len(files))

	for _, fileHeader := range files {
		go func(fileHeader *multipart.FileHeader) {
			file, err := fileHeader.Open()
			if err != nil {
				resultChan <- result{
					uploaded: nil,
					Err:      fmt.Errorf("failed to open file %s: %w", fileHeader.Filename, err),
				}
				return
			}
			defer file.Close()

			uploadedFile, err := c.cld.Upload.Upload(ctx, file, uploader.UploadParams{
				DisplayName: fileHeader.Filename,
				AssetFolder: folder.Path,
			})
			if err != nil {
				resultChan <- result{
					uploaded: nil,
					Err:      fmt.Errorf("failed to upload file %s: %w", fileHeader.Filename, err),
				}
				return
			}

			resultChan <- result{
				uploaded: uploadedFile,
				Err:      nil,
			}
		}(fileHeader)
	}

	var uploadedFiles []*uploader.UploadResult
	var errs []string

	for i := 0; i < len(files); i++ {
		res := <-resultChan
		if res.Err != nil {
			errs = append(errs, res.Err.Error())
		} else {
			uploadedFiles = append(uploadedFiles, res.uploaded)
		}
	}

	if len(errs) > 0 {
		return uploadedFiles, fmt.Errorf("upload errors: %s", strings.Join(errs, ", "))
	}

	return uploadedFiles, nil
}

func (c *Cloudinary) DeleteTaskFile(ctx context.Context, fileID string) error {
	result, err := c.cld.Admin.DeleteAssets(ctx, admin.DeleteAssetsParams{
		PublicIDs:    []string{fileID},
		DeliveryType: "upload",
	})
	if err != nil || result.Deleted[fileID] != "deleted" {
		return fmt.Errorf("error while deleting file on cloudinary: %w", err)
	}

	return nil
}

func (c *Cloudinary) DeleteTaskFiles(ctx context.Context, taskID string, fileIDs []string) error {
	if len(fileIDs) > 0 {
		_, err := c.cld.Admin.DeleteAssets(ctx, admin.DeleteAssetsParams{
			PublicIDs:    fileIDs,
			DeliveryType: "upload",
		})
		if err != nil {
			return fmt.Errorf("error while deleting files on cloudinary: %w", err)
		}

		_, err = c.cld.Admin.DeleteFolder(ctx, admin.DeleteFolderParams{Folder: fmt.Sprintf("taskmate/%s", taskID)})
		if err != nil {
			return fmt.Errorf("error while deleting file folder on cloudinary: %w", err)
		}
	}

	return nil
}
