import boto3
import uuid
import base64
import os

class S3Service:
    s3_client = None
    
    @staticmethod
    def get_instance():
        if not S3Service.s3_client:
            S3Service.s3_client = boto3.client(
                's3',
                region_name=os.getenv('AWS_REGION'),
                aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
                aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY')
            )
        return S3Service.s3_client
    
    @staticmethod
    def upload_base64(base64_string):
        header, base64_data = base64_string.split(',')
        content_type = header.split(';')[0].split(':')[1]
        
        if not content_type:
            return None, 'Invalid base64 string'
        
        url, error = S3Service.upload_base64_image(content_type, base64_data)
        return url, error
    @staticmethod
    def upload_base64_pdf(base64_string):
        header, base64_data = base64_string.split(',')
        content_type = header.split(';')[0].split(':')[1]
        
        if not content_type:
            return None, 'Invalid base64 string'
        
        url, error = S3Service.upload_base64_fac(content_type, base64_data)
        return url, error
    

    @staticmethod
    def upload_base64_image(content_type, base64_data):
        base64_data = base64_data.replace('\n', '').replace('\r', '').replace(' ', '')

        try:
            buffer = base64.b64decode(base64_data)
            bucket_name = os.getenv('AWS_BUCKET_NAME')
            
            filename = f'Fotos/{uuid.uuid4()}'
            
            response = S3Service.get_instance().put_object(
                Bucket=bucket_name,
                Key=filename,
                Body=buffer,
                ContentEncoding='base64',
                ContentType=content_type
            )
            url = f'https://{bucket_name}.s3.amazonaws.com/{filename}'
            return url, None
        except Exception as e:
            return None, str(e)
        
 
    @staticmethod
    def upload_base64_fac(content_type, base64_data):
        base64_data = base64_data.replace('\n', '').replace('\r', '').replace(' ', '')

        try:
            buffer = base64.b64decode(base64_data)
            bucket_name = os.getenv('AWS_BUCKET_NAME')
            
            filename = f'Facturas/{uuid.uuid4()}'
            
            response = S3Service.get_instance().put_object(
                Bucket=bucket_name,
                Key=filename,
                Body=buffer,
                ContentEncoding='base64',
                ContentType=content_type
            )
            url = f'https://{bucket_name}.s3.amazonaws.com/{filename}'
            return url, None
        except Exception as e:
            return None, str(e)
        